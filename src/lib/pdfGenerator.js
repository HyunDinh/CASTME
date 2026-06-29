import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Tạo PDF trong RAM và trả về Buffer (không ghi file ra ổ cứng)
 * @returns {Promise<Buffer>}
 */
export async function generateContractPDFBuffer(shopName, kolName, budget) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Load fonts hỗ trợ Tiếng Việt
      const fontRegular = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");
      const fontBold = path.join(process.cwd(), "public", "fonts", "Roboto-Bold.ttf");

      if (fs.existsSync(fontRegular) && fs.existsSync(fontBold)) {
        doc.registerFont("Regular", fontRegular);
        doc.registerFont("Bold", fontBold);
      } else {
        doc.registerFont("Regular", "Helvetica");
        doc.registerFont("Bold", "Helvetica-Bold");
      }

      // ---------------- NỘI DUNG HỢP ĐỒNG ---------------- //
      doc.font("Bold").fontSize(14).text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", { align: "center" });
      doc.font("Bold").fontSize(13).text("Độc lập - Tự do - Hạnh phúc", { align: "center" });
      doc.moveDown(2);

      doc.font("Bold").fontSize(18).text("HỢP ĐỒNG HỢP TÁC QUẢNG CÁO", { align: "center" });
      doc.moveDown(2);

      doc.font("Bold").fontSize(12).text("BÊN A (SHOP/DOANH NGHIỆP):");
      doc.font("Regular").text(`- Tên cửa hàng/doanh nghiệp: ${shopName || "N/A"}`);
      doc.moveDown(1);

      doc.font("Bold").text("BÊN B (KOL/KOC/CREATOR):");
      doc.font("Regular").text(`- Tên Creator: ${kolName || "N/A"}`);
      doc.moveDown(2);

      doc.font("Bold").text("ĐIỀU 1: NỘI DUNG CÔNG VIỆC");
      doc.font("Regular").text("Bên B đồng ý thực hiện việc sáng tạo nội dung và quảng bá sản phẩm cho Bên A theo kịch bản và yêu cầu đã thống nhất trên nền tảng CASTME.");
      doc.moveDown(1);

      doc.font("Bold").text("ĐIỀU 2: PHÍ DỊCH VỤ VÀ THANH TOÁN");
      doc.font("Regular").text(`- Tổng ngân sách (Phí dịch vụ): ${budget || "0 VNĐ"}`);
      doc.text("- Thanh toán sẽ được giải ngân thông qua nền tảng sau khi Bên A nghiệm thu các mốc công việc (Milestones).");
      doc.moveDown(1);

      doc.font("Bold").text("ĐIỀU 3: ĐIỀU KHOẢN CHUNG");
      doc.font("Regular").text("Hai bên cam kết thực hiện đúng các điều khoản đã thỏa thuận. Mọi tranh chấp nếu có sẽ được giải quyết thông qua thương lượng hoặc theo quy định của pháp luật hiện hành.");
      doc.moveDown(4);

      // ---------------- PHẦN KÝ TÊN ---------------- //
      const signatureY = 650;

      doc.font("Bold").fontSize(12);
      doc.text("ĐẠI DIỆN BÊN A", 50, signatureY, { width: 200, align: "center" });
      doc.font("Regular").fontSize(10).text("(Ký và ghi rõ họ tên)", 50, signatureY + 15, { width: 200, align: "center" });

      doc.font("Bold").fontSize(12);
      doc.text("ĐẠI DIỆN BÊN B", 345, signatureY, { width: 200, align: "center" });
      doc.font("Regular").fontSize(10).text("(Ký và ghi rõ họ tên)", 345, signatureY + 15, { width: 200, align: "center" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
