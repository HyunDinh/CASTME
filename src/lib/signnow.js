import fs from "fs";
import path from "path";
import { generateContractPDFBuffer } from "./pdfGenerator.js";

const API_BASE = process.env.SIGNNOW_BASE_URL || "https://api.signnow.com";
const API_KEY = process.env.SIGNNOW_API_KEY;
const CLIENT_ID = process.env.SIGNNOW_CLIENT_ID;
const CLIENT_SECRET = process.env.SIGNNOW_CLIENT_SECRET;
const USERNAME = process.env.SIGNNOW_USERNAME;
const PASSWORD = process.env.SIGNNOW_PASSWORD;

async function getAccessToken() {
  if (API_KEY) return API_KEY;
  if (!CLIENT_ID) return "MOCK_TOKEN";

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", USERNAME);
  formData.append("password", PASSWORD);
  formData.append("scope", "*");

  const res = await fetch(`${API_BASE}/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to get SignNow token: ${errText}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function uploadToCloudinary(buffer, filename) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Thiếu cấu hình Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME hoặc NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)");
    return null;
  }

  const blob = new Blob([buffer], { type: "application/pdf" });
  const formData = new FormData();
  formData.append("file", blob, filename);
  formData.append("upload_preset", uploadPreset);
  formData.append("resource_type", "raw");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    console.error("Cloudinary Upload Error:", await res.text());
    return null;
  }

  const data = await res.json();
  return data.secure_url;
}

export async function createSignatureRequest(appRecord) {
  const shopEmail = appRecord.job.shop.email;
  const kolEmail = appRecord.creator.email;

  if (!API_KEY && !CLIENT_ID) {
    console.log("Mocking SignNow (No credentials provided)");
    return { success: true, documentId: `mock_signnow_${Date.now()}` };
  }

  try {
    const token = await getAccessToken();
    const authHeader = `Bearer ${token}`;

    // Step 0: Tạo PDF trong RAM rồi upload lên Cloudinary thay vì lưu local
    const filename = `contract_${Date.now()}.pdf`;
    const { pdfBuffer, signatureLocations } = await generateContractPDFBuffer(appRecord);
    const cloudinaryUrl = await uploadToCloudinary(pdfBuffer, filename);

    // Upload lên SignNow
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const uploadForm = new FormData();
    uploadForm.append("file", blob, "contract.pdf");

    const uploadRes = await fetch(`${API_BASE}/document`, {
      method: "POST",
      headers: { "Authorization": authHeader },
      body: uploadForm
    });
    if (!uploadRes.ok) throw new Error("Upload failed: " + await uploadRes.text());
    const uploadData = await uploadRes.json();
    const documentId = uploadData.id;

    // Step 1: Add Fields
    const fieldsRes = await fetch(`${API_BASE}/document/${documentId}`, {
      method: "PUT",
      headers: { "Authorization": authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [
          { 
            x: signatureLocations.shopSignature.x, 
            y: signatureLocations.shopSignature.y, 
            width: signatureLocations.shopSignature.width, 
            height: signatureLocations.shopSignature.height, 
            type: "signature", 
            page_number: signatureLocations.page_number, 
            role: "Shop", 
            required: true, 
            name: "shop_sig" 
          },
          { 
            x: signatureLocations.creatorSignature.x, 
            y: signatureLocations.creatorSignature.y, 
            width: signatureLocations.creatorSignature.width, 
            height: signatureLocations.creatorSignature.height, 
            type: "signature", 
            page_number: signatureLocations.page_number, 
            role: "KOL", 
            required: true, 
            name: "kol_sig" 
          }
        ]
      })
    });
    if (!fieldsRes.ok) throw new Error("Add fields failed: " + await fieldsRes.text());

    // Get roles
    const docRes = await fetch(`${API_BASE}/document/${documentId}`, {
      method: "GET",
      headers: { "Authorization": authHeader }
    });
    const docData = await docRes.json();
    const roles = docData.roles || [];
    const shopRole = roles.find(r => r.name === "Shop");
    const kolRole = roles.find(r => r.name === "KOL");

    // Step 2: Send Invite
    const inviteRes = await fetch(`${API_BASE}/document/${documentId}/invite`, {
      method: "POST",
      headers: { "Authorization": authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({
        to: [
          { email: shopEmail, role_id: shopRole?.unique_id || "", role: "Shop", order: 1, subject: "", message: "" },
          { email: kolEmail, role_id: kolRole?.unique_id || "", role: "KOL", order: 1, subject: "", message: "" }
        ],
        from: process.env.SIGNNOW_SENDER_EMAIL || process.env.SIGNNOW_USERNAME
      })
    });
    if (!inviteRes.ok) throw new Error("Send invite failed: " + await inviteRes.text());

    return { success: true, documentId, pdfUrl: cloudinaryUrl };
  } catch (err) {
    console.error("SignNow Error:", err);
    return { success: false, error: err.message };
  }
}

export async function checkDocumentStatus(documentId) {
  if (!documentId) return { success: false };
  if (documentId.startsWith("mock_")) return { success: true, status: "fulfilled" };

  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE}/document/${documentId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to check status");
    const data = await res.json();

    let isFulfilled = false;
    if (data.status === "fulfilled") isFulfilled = true;
    else if (data.signatures && data.signatures.length >= 2) isFulfilled = true;

    return { success: true, status: isFulfilled ? "fulfilled" : "pending", data };
  } catch (e) {
    console.error("SignNow check status error:", e);
    return { success: false, error: e.message };
  }
}

export async function downloadSignedDocument(documentId) {
  if (!documentId || documentId.startsWith("mock_")) return null;

  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE}/document/${documentId}/download?type=collapsed`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to download signed document");

    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = `completed_${documentId}.pdf`;
    
    const cloudinaryUrl = await uploadToCloudinary(buffer, filename);
    return cloudinaryUrl;
  } catch (err) {
    console.error("SignNow Download Error:", err);
    return null;
  }
}
