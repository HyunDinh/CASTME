# Yêu cầu nâng cấp tính năng sinh hợp đồng PDF cho nền tảng CASTME

## Bối cảnh

Tôi đang phát triển nền tảng CASTME - Marketplace kết nối Doanh nghiệp và KOL/KOC.

Hiện tại hệ thống đã có chức năng sinh hợp đồng PDF bằng PDFKit (NodeJS). Tuy nhiên nội dung hợp đồng còn quá đơn giản và chỉ mang tính minh họa.

Tôi muốn AI nâng cấp hợp đồng này thành một mẫu hợp đồng chuyên nghiệp, có cấu trúc giống các hợp đồng hợp tác KOL/KOC thực tế, đồng thời phù hợp với mô hình hoạt động của nền tảng CASTME.

Lưu ý:

- Không sao chép nguyên văn bất kỳ mẫu hợp đồng nào trên Internet.
- Chỉ tham khảo cấu trúc và các điều khoản phổ biến.
- Nội dung cần được viết lại theo văn phong pháp lý rõ ràng, dễ hiểu.
- Hợp đồng phải phù hợp với pháp luật Việt Nam ở mức tham khảo (không cần thay thế tư vấn pháp lý).

---

# Mục tiêu

Thiết kế lại toàn bộ nội dung hợp đồng PDF.

Không chỉ sửa vài đoạn text.

Cần thiết kế lại đầy đủ:

- Bố cục
- Điều khoản
- Thứ tự các mục
- Cách trình bày
- Khả năng mở rộng sau này

---

# Thông tin đầu vào

Hiện tại hệ thống có thể truyền vào:

- Doanh nghiệp
- KOL/KOC
- Campaign
- Proposal
- Job
- Budget
- Milestones

Có thể bổ sung thêm nếu cần.

---

# Thiết kế hợp đồng

## Trang đầu

Hiển thị:

Quốc hiệu

Tiêu ngữ

Tên hợp đồng

Ví dụ

HỢP ĐỒNG HỢP TÁC QUẢNG BÁ
GIỮA DOANH NGHIỆP VÀ KOL/KOC

Ngày ký

Mã hợp đồng

---

## Điều 1. Thông tin các bên

### Bên A

Bao gồm

- Tên doanh nghiệp
- Người đại diện
- Email
- Số điện thoại
- Địa chỉ (nếu có)

### Bên B

Bao gồm

- Họ tên KOL/KOC
- Email
- Số điện thoại
- Link mạng xã hội
- Tên kênh

---

## Điều 2. Mục đích hợp tác

Mô tả mục đích hợp tác giữa hai bên.

Ví dụ

- Quảng bá sản phẩm
- Quảng bá thương hiệu
- Review sản phẩm
- Livestream
- Affiliate

Không hardcode.

Sinh theo dữ liệu Campaign.

---

## Điều 3. Nội dung công việc

Hiển thị đầy đủ các thông tin của Campaign.

Ví dụ

Tên chiến dịch

Nền tảng

TikTok

Facebook

Instagram

Youtube

Loại nội dung

- Video
- Bài viết
- Livestream

Số lượng

Ví dụ

2 video

1 livestream

Yêu cầu

- Hashtag
- Mention
- Link sản phẩm
- CTA
- Guideline

Nếu Campaign có Deliverables thì render thành danh sách.

---

## Điều 4. Tiến độ thực hiện

Render Milestones thành bảng.

Ví dụ

STT

Tên milestone

Mô tả

Deadline

Trạng thái

Nếu có nhiều milestone thì tự động xuống dòng.

Không hardcode.

---

## Điều 5. Giá trị hợp đồng

Hiển thị

Tổng ngân sách

Ví dụ

20.000.000 VNĐ

Nếu có

- Booking fee
- Content fee
- Bonus
- Thuế

thì hiển thị thành bảng.

Thanh toán

Mô tả quy trình thanh toán của CASTME

Ví dụ

- Người thuê ký quỹ
- CASTME giữ tiền
- Sau khi milestone được nghiệm thu sẽ giải ngân
- Thanh toán vào tài khoản đã xác thực

---

## Điều 6. Quyền và nghĩa vụ

### Bên A

Ví dụ

- Cung cấp brief
- Cung cấp sản phẩm
- Phản hồi đúng thời hạn
- Thanh toán đúng hạn

### Bên B

Ví dụ

- Thực hiện đúng nội dung
- Đúng deadline
- Không vi phạm pháp luật
- Không sử dụng nội dung trái phép
- Chịu trách nhiệm với nội dung đã đăng

Không viết quá dài.

---

## Điều 7. Quyền sử dụng nội dung

Đây là điều khoản rất quan trọng.

Bao gồm

- Doanh nghiệp được phép sử dụng nội dung trong bao lâu
- Có được chạy quảng cáo hay không
- Có được chỉnh sửa video hay không
- Có được đăng lại trên fanpage hay không

Thiết kế theo dạng tùy chọn để sau này có thể cấu hình.

---

## Điều 8. Bảo mật

Hai bên cam kết không tiết lộ

- Giá booking
- Brief
- Dữ liệu chiến dịch
- Thông tin khách hàng

trừ trường hợp pháp luật yêu cầu.

---

## Điều 9. Vi phạm hợp đồng

Ví dụ

Nếu KOL

- Không đăng bài
- Sai deadline
- Sai nội dung

Doanh nghiệp có quyền

- Yêu cầu chỉnh sửa
- Từ chối nghiệm thu
- Hủy hợp đồng

Nếu doanh nghiệp

- Không thanh toán

KOL có quyền khiếu nại.

---

## Điều 10. Chấm dứt hợp đồng

Các trường hợp

- Hoàn thành hợp đồng
- Hai bên đồng ý kết thúc
- Một bên vi phạm nghiêm trọng

---

## Điều 11. Giải quyết tranh chấp

Ưu tiên thương lượng.

Nếu không thành công thì giải quyết theo quy định pháp luật Việt Nam.

---

# Chữ ký

Thiết kế đẹp hơn.

BÊN A

Đại diện doanh nghiệp

Ký

Họ tên

Ngày ký

BÊN B

KOL/KOC

Ký

Họ tên

Ngày ký

Để khoảng trắng đủ lớn cho chữ ký.

---

# Yêu cầu về giao diện PDF

Không chỉ dùng text liên tục.

Cần:

- Font tiếng Việt đẹp
- Heading rõ ràng
- Khoảng cách hợp lý
- Divider
- Bảng cho Milestones
- Bảng cho Thanh toán
- Canh lề đẹp
- Tự xuống trang nếu nội dung dài

Không để chữ bị cắt.

Không ghi đè lên phần chữ ký.

---

# Yêu cầu về Code

Không viết toàn bộ nội dung PDF trong một hàm.

Refactor thành các hàm riêng.

Ví dụ

renderHeader()

renderPartyInformation()

renderCampaignInformation()

renderMilestones()

renderPayment()

renderRights()

renderConfidentiality()

renderTermination()

renderSignature()

Mỗi hàm chỉ render một phần.

---

# Khả năng mở rộng

Thiết kế để sau này dễ mở rộng.

Ví dụ

Sau này Campaign có thêm

- Livestream
- Affiliate
- Booking nhiều KOL
- Bonus
- KPI
- KPI theo View
- KPI theo Click
- KPI theo Conversion

thì chỉ cần thêm dữ liệu mà không phải sửa toàn bộ hợp đồng.

Không hardcode nội dung.

Ưu tiên render theo dữ liệu truyền vào.

---

# Kết quả mong muốn

AI cần:

1. Thiết kế lại toàn bộ nội dung hợp đồng.

2. Thiết kế lại bố cục PDF chuyên nghiệp.

3. Refactor code PDFKit theo hướng dễ bảo trì.

4. Viết code sạch, chia nhỏ thành nhiều hàm.

5. Hỗ trợ tự động xuống trang.

6. Hỗ trợ render bảng.

7. Hỗ trợ tiếng Việt đầy đủ.

8. Đảm bảo hợp đồng nhìn giống tài liệu thực tế của doanh nghiệp thay vì chỉ là bản demo.
