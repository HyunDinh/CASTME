import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Helper để vẽ một Table
 * @param {PDFDocument} doc 
 * @param {Array} table Dữ liệu bảng: { headers: [], rows: [] }
 * @param {number} startX 
 * @param {number} startY 
 */
function drawTable(doc, table, startX, startY) {
  const columnCount = table.headers.length;
  // Use a fixed width table
  const tableWidth = 500;
  
  let currentY = startY;

  // Tính chiều rộng các cột (tạm thời chia theo tỉ lệ cơ bản)
  const columnWidths = [];
  if (columnCount === 4) {
    columnWidths.push(40); // STT
    columnWidths.push(160); // Tên
    columnWidths.push(200); // Mô tả
    columnWidths.push(100); // Trạng thái
  } else {
    for (let i = 0; i < columnCount; i++) columnWidths.push(tableWidth / columnCount);
  }

  // Draw headers
  doc.font("Bold").fontSize(10);
  let currentX = startX;
  
  // Background header
  doc.rect(startX, currentY, tableWidth, 25).fillAndStroke("#f3f4f6", "#e5e7eb");
  doc.fillColor("#111827");
  
  for (let i = 0; i < columnCount; i++) {
    doc.text(table.headers[i], currentX + 5, currentY + 7, { width: columnWidths[i] - 10, align: "center" });
    currentX += columnWidths[i];
  }
  
  currentY += 25;

  // Draw rows
  doc.font("Regular").fontSize(10);
  table.rows.forEach(row => {
    // Determine row height
    let maxRowHeight = 25;
    for (let i = 0; i < columnCount; i++) {
      const textHeight = doc.heightOfString(row[i] || "", { width: columnWidths[i] - 10 });
      if (textHeight + 10 > maxRowHeight) maxRowHeight = textHeight + 10;
    }

    // Auto page break if needed
    if (currentY + maxRowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      currentY = doc.page.margins.top;
      // Draw headers again
      doc.font("Bold");
      doc.rect(startX, currentY, tableWidth, 25).fillAndStroke("#f3f4f6", "#e5e7eb");
      doc.fillColor("#111827");
      let hdrX = startX;
      for (let i = 0; i < columnCount; i++) {
        doc.text(table.headers[i], hdrX + 5, currentY + 7, { width: columnWidths[i] - 10, align: "center" });
        hdrX += columnWidths[i];
      }
      currentY += 25;
      doc.font("Regular");
    }

    doc.rect(startX, currentY, tableWidth, maxRowHeight).stroke("#e5e7eb");
    
    currentX = startX;
    for (let i = 0; i < columnCount; i++) {
      doc.text(row[i] || "", currentX + 5, currentY + 7, { width: columnWidths[i] - 10 });
      // Draw vertical line separator
      if (i < columnCount - 1) {
        doc.moveTo(currentX + columnWidths[i], currentY)
           .lineTo(currentX + columnWidths[i], currentY + maxRowHeight)
           .stroke("#e5e7eb");
      }
      currentX += columnWidths[i];
    }
    
    currentY += maxRowHeight;
  });

  doc.moveDown(1);
  return currentY;
}

function checkAutoPage(doc, requiredHeight) {
  if (doc.y + requiredHeight > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

/**
 * Xây dựng nội dung hợp đồng
 */
export async function generateContractPDFBuffer(appRecord) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const signatureLocations = calculateSignatureLocations();
        resolve({ pdfBuffer: Buffer.concat(chunks), signatureLocations });
      });
      doc.on("error", reject);

      const fontRegular = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");
      const fontBold = path.join(process.cwd(), "public", "fonts", "Roboto-Bold.ttf");

      if (fs.existsSync(fontRegular) && fs.existsSync(fontBold)) {
        doc.registerFont("Regular", fontRegular);
        doc.registerFont("Bold", fontBold);
      } else {
        doc.registerFont("Regular", "Helvetica");
        doc.registerFont("Bold", "Helvetica-Bold");
      }

      // Khởi tạo các biến để lưu trang hiện tại
      let signatureLocations = {};
      const calculateSignatureLocations = () => signatureLocations;

      // Render Header
      doc.font("Bold").fontSize(13).text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", { align: "center" });
      doc.fontSize(12).text("Độc lập - Tự do - Hạnh phúc", { align: "center" });
      doc.moveDown(1);
      doc.fontSize(10).text(`Số: ${appRecord.id.slice(-6).toUpperCase()}/HĐHT/CASTME`, { align: "center" });
      doc.moveDown(2);

      doc.font("Bold").fontSize(16).text("HỢP ĐỒNG HỢP TÁC QUẢNG CÁO", { align: "center" });
      doc.fontSize(12).text("GIỮA DOANH NGHIỆP VÀ KOL/KOC", { align: "center" });
      
      const today = new Date();
      doc.font("Regular").fontSize(11).text(
        `Hôm nay, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}, chúng tôi gồm có:`, 
        { align: "center" }
      );
      doc.moveDown(2);

      // Render Party A (Shop)
      const shop = appRecord.job.shop;
      checkAutoPage(doc, 100);
      doc.font("Bold").fontSize(12).text("BÊN A (DOANH NGHIỆP):", { underline: true });
      doc.font("Regular").fontSize(11);
      doc.text(`Tên doanh nghiệp: ${shop.name || "N/A"}`);
      doc.text(`Email: ${shop.email || "N/A"}`);
      doc.moveDown(1);

      // Render Party B (Creator)
      const creator = appRecord.creator;
      const creatorProfile = creator.creatorProfile || {};
      checkAutoPage(doc, 100);
      doc.font("Bold").fontSize(12).text("BÊN B (KOL/KOC):", { underline: true });
      doc.font("Regular").fontSize(11);
      doc.text(`Họ và tên: ${creator.name || "N/A"}`);
      doc.text(`Email: ${creator.email || "N/A"}`);
      if (creatorProfile.portfolioUrl) {
        doc.text(`Kênh hoạt động chính: ${creatorProfile.portfolioUrl}`);
      }
      doc.moveDown(1.5);

      doc.font("Regular").text("Hai bên thống nhất ký kết Hợp đồng hợp tác quảng cáo (\"Hợp đồng\") với các điều khoản sau:");
      doc.moveDown(1);

      // Điều 1
      checkAutoPage(doc, 50);
      doc.font("Bold").fontSize(12).text("ĐIỀU 1: MỤC ĐÍCH HỢP TÁC");
      doc.font("Regular").fontSize(11).text("Bên B đồng ý cung cấp dịch vụ sáng tạo nội dung, quảng bá sản phẩm/dịch vụ cho Bên A thông qua các nền tảng mạng xã hội nhằm tăng nhận diện thương hiệu và thúc đẩy tiếp thị theo yêu cầu của chiến dịch.");
      doc.moveDown(1);

      // Điều 2
      const job = appRecord.job;
      checkAutoPage(doc, 100);
      doc.font("Bold").fontSize(12).text("ĐIỀU 2: NỘI DUNG CÔNG VIỆC");
      doc.font("Regular").fontSize(11);
      doc.text(`Tên chiến dịch: ${job.title}`);
      doc.text(`Chi tiết công việc:`);
      doc.text(job.description || "Thực hiện theo yêu cầu chi tiết trên nền tảng CASTME.", { indent: 20 });
      doc.moveDown(1);

      // Điều 3 (Milestones)
      checkAutoPage(doc, 50);
      doc.font("Bold").fontSize(12).text("ĐIỀU 3: TIẾN ĐỘ THỰC HIỆN");
      doc.font("Regular").fontSize(11).text("Bên B cam kết thực hiện công việc theo các giai đoạn sau:");
      doc.moveDown(0.5);
      
      const milestones = appRecord.job.milestones || [];
      const tableData = {
        headers: ["STT", "Giai đoạn", "Chi tiết", "Loại"],
        rows: milestones.map((m, index) => [
          (index + 1).toString(),
          m.title,
          "Hoàn thành các yêu cầu trong giai đoạn này trên nền tảng.",
          m.type
        ])
      };
      
      if (milestones.length > 0) {
        const tableEndY = drawTable(doc, tableData, doc.page.margins.left, doc.y);
        doc.y = tableEndY;
      } else {
        doc.text("- Các giai đoạn công việc được quy định chi tiết trên hệ thống CASTME.", { indent: 20 });
      }
      doc.moveDown(1);

      // Điều 4
      checkAutoPage(doc, 80);
      doc.font("Bold").fontSize(12).text("ĐIỀU 4: GIÁ TRỊ HỢP ĐỒNG VÀ THANH TOÁN");
      doc.font("Regular").fontSize(11);
      doc.text(`1. Tổng giá trị hợp đồng (Phí dịch vụ): ${job.budget} VNĐ`);
      doc.text(`2. Phương thức thanh toán:`);
      doc.text(`- Bên A đã ký quỹ toàn bộ số tiền trên hệ thống CASTME.`, { indent: 20 });
      doc.text(`- Nền tảng CASTME sẽ tự động giải ngân cho Bên B sau khi các mốc công việc (Milestones) được Bên A nghiệm thu thành công.`, { indent: 20 });
      doc.moveDown(1);

      // Điều 5
      checkAutoPage(doc, 100);
      doc.font("Bold").fontSize(12).text("ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CÁC BÊN");
      doc.font("Bold").fontSize(11).text("Quyền và nghĩa vụ Bên A:", { indent: 10 });
      doc.font("Regular").text("- Cung cấp đầy đủ thông tin, sản phẩm, và guideline cho Bên B.");
      doc.text("- Phản hồi và nghiệm thu các sản phẩm bàn giao đúng thời hạn quy định.");
      doc.font("Bold").text("Quyền và nghĩa vụ Bên B:", { indent: 10 });
      doc.font("Regular").text("- Thực hiện đúng kịch bản, số lượng, và chất lượng cam kết.");
      doc.text("- Đảm bảo nội dung không vi phạm bản quyền và tuân thủ pháp luật hiện hành.");
      doc.text("- Chịu trách nhiệm trực tiếp với thông điệp quảng bá trên kênh của mình.");
      doc.moveDown(1);

      // Điều 6
      checkAutoPage(doc, 60);
      doc.font("Bold").fontSize(12).text("ĐIỀU 6: QUYỀN SỬ DỤNG NỘI DUNG");
      doc.font("Regular").fontSize(11).text("Bên A có quyền sử dụng hình ảnh và nội dung do Bên B tạo ra trong khuôn khổ chiến dịch này để đăng tải lại trên các kênh truyền thông chính thức của Bên A trong thời gian chiến dịch diễn ra, trừ khi có thỏa thuận khác.");
      doc.moveDown(1);

      // Điều 7 & 8
      checkAutoPage(doc, 100);
      doc.font("Bold").fontSize(12).text("ĐIỀU 7: BẢO MẬT THÔNG TIN");
      doc.font("Regular").fontSize(11).text("Hai bên cam kết bảo mật mọi thông tin liên quan đến hợp đồng (giá cả, chiến lược, thông tin khách hàng) và không cung cấp cho bên thứ ba khi chưa có sự đồng ý.");
      doc.moveDown(1);

      doc.font("Bold").fontSize(12).text("ĐIỀU 8: VI PHẠM VÀ CHẤM DỨT HỢP ĐỒNG");
      doc.font("Regular").fontSize(11).text("Hợp đồng sẽ chấm dứt khi hai bên hoàn tất mọi nghĩa vụ, hoặc một trong hai bên vi phạm nghiêm trọng (sai tiến độ, nội dung sai sự thật) mà không khắc phục được sau khi có yêu cầu.");
      doc.moveDown(1);

      // Điều 9
      checkAutoPage(doc, 60);
      doc.font("Bold").fontSize(12).text("ĐIỀU 9: GIẢI QUYẾT TRANH CHẤP");
      doc.font("Regular").fontSize(11).text("Mọi tranh chấp sẽ được ưu tiên giải quyết thông qua thương lượng. Nếu không thành, sự việc sẽ được đưa ra cơ quan có thẩm quyền tại Việt Nam giải quyết theo luật định.");
      doc.moveDown(2);

      // Phần Chữ ký
      checkAutoPage(doc, 120); // Đảm bảo đủ khoảng trống cho chữ ký
      const signatureY = doc.y + 10;
      
      doc.font("Bold").fontSize(12);
      doc.text("ĐẠI DIỆN BÊN A", 60, signatureY, { width: 200, align: "center" });
      doc.font("Regular").fontSize(10).text("(Ký và ghi rõ họ tên)", 60, signatureY + 15, { width: 200, align: "center" });

      doc.font("Bold").fontSize(12);
      doc.text("ĐẠI DIỆN BÊN B", 335, signatureY, { width: 200, align: "center" });
      doc.font("Regular").fontSize(10).text("(Ký và ghi rõ họ tên)", 335, signatureY + 15, { width: 200, align: "center" });

      // Lưu lại tọa độ chữ ký, quy đổi về chỉ số trang 0-indexed cho SignNow/SignQuick
      const currentPage = doc.bufferedPageRange().count - 1; 
      // Kích thước signature box mặc định
      const sigWidth = 150;
      const sigHeight = 50;
      
      signatureLocations = {
        page_number: currentPage,
        shopSignature: {
          x: Math.round(85), 
          y: Math.round(signatureY + 30), 
          width: Math.round(sigWidth),
          height: Math.round(sigHeight)
        },
        creatorSignature: {
          x: Math.round(360), 
          y: Math.round(signatureY + 30),
          width: Math.round(sigWidth),
          height: Math.round(sigHeight)
        }
      };

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
