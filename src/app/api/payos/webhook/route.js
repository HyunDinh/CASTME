// api/payos/webhook/route.js
import { prisma } from "#/lib/prisma";
import { PayOS } from "@payos/node";
import { finalizePaymentMilestone } from "#/app/(shop)/my-casting/applications.actions";

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const webhookResult = await payos.webhooks.verify(body);
    const webhookData = webhookResult?.data || webhookResult;

    if (!webhookData || webhookData.code !== "00") {
      return Response.json({ success: false, message: "Thanh toán không thành công" }, { status: 400 });
    }

    const { orderCode, amount } = webhookData;
    if (!orderCode || !amount) {
      return Response.json({ success: false, message: "Thiếu dữ liệu" }, { status: 400 });
    }

    // Tìm milestone theo orderCode (cách tốt hơn)
    const milestone = await prisma.milestone.findFirst({
      where: {
        type: "PAYMENT",
        // Tìm theo submission chứa orderCode (backup)
        OR: [
          { submission: { contains: String(orderCode) } },
          // Nếu bạn sẽ lưu orderCode riêng sau này
        ]
      },
      include: {
        job: {
          include: {
            applications: {
              where: { status: "ACCEPTED" },
              take: 1,
            },
          },
        },
      },
    });

    if (!milestone) {
      console.error(`Không tìm thấy milestone cho orderCode: ${orderCode}`);
      return Response.json({ success: false, message: "Không tìm thấy thông tin" }, { status: 404 });
    }

    const totalAmount = Number(amount);
    const result = await finalizePaymentMilestone(milestone, totalAmount);

    if (!result.success) {
      return Response.json({ success: false, message: result.error || "Không thể cập nhật thanh toán" }, { status: 500 });
    }

    console.log(`✅ Thanh toán thành công - OrderCode: ${orderCode} | Creator: ${result.data?.creatorId} | Net: ${result.data?.netAmount}`);
    return Response.json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return Response.json({ 
      success: false, 
      message: error.message || "Lỗi server" 
    }, { status: 500 });
  }
}