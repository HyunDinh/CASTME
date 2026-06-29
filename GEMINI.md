Tài liệu Kỹ thuật Tích hợp API SignQuick cho AI Coding Agent

Tài liệu này được biên soạn bởi chuyên gia Kiến trúc Giải pháp nhằm cung cấp hướng dẫn tích hợp chi tiết API SignQuick vào hệ thống AI Coding Agent. Mục tiêu trọng tâm là tự động hóa quy trình ký hợp đồng giữa Shop và KOL, đảm bảo tính pháp lý cao nhất và tối ưu hóa vận hành trong điều kiện giới hạn của gói miễn phí.

1. Tổng quan Dự án & Mục tiêu Tích hợp

Hệ thống hướng tới việc tự động hóa toàn bộ vòng đời của văn bản ký kết, giảm thiểu can thiệp thủ công và đảm bảo sự minh bạch về mặt pháp lý (tuân thủ ESIGN và UETA).

Các mục tiêu cốt lõi:

- Tự động hóa luồng ký: Tự động gửi, theo dõi và lưu trữ hợp đồng.
- Đảm bảo tính pháp lý: Đảm bảo mọi văn bản đều có chữ ký điện tử hợp lệ và đi kèm biên bản kiểm tra (Audit Trail).
- Quản lý hạn mức: Tối ưu hóa việc sử dụng gói miễn phí của SignQuick (giới hạn 5 tài liệu/tháng trong môi trường Production). Do hạn mức thấp, việc lưu trữ tự động sau khi ký là bắt buộc để tránh mất dữ liệu.
- Đối tượng tham gia luồng ký tuần tự:
  1. Hệ thống (Người gửi): Khởi tạo yêu cầu và quản lý trạng thái.
  2. Shop (Người ký 1): Bên ký A
  3. KOL (Người ký 2): Bên ký B

2. Thông số Kỹ thuật & Xác thực API

SignQuick cung cấp giao diện REST API sử dụng định dạng JSON cho mọi phản hồi.

Thông số cơ bản

Thông số Giá trị chi tiết
Base URL https://api.signquick.app/v1 (Lưu ý: Đây là định dạng tiêu chuẩn, cần kiểm tra lại tài liệu mới nhất từ SignQuick để xác nhận endpoint chính xác).
Phương thức xác thực API Key truyền qua Header (Authorization: Bearer <API_KEY>).
Định dạng dữ liệu JSON (UTF-8).
Giới hạn tốc độ (Rate Limit) 100 requests/minute.

Cấu hình Bảo mật Biến môi trường

Tuyệt đối không để lộ API Key trong mã nguồn client-side. Cấu hình các giá trị nhạy cảm trong tệp .env:

# .env file

SIGNQUICK_API_KEY=your_production_api_key_here
SIGNQUICK_WEBHOOK_SECRET=your_webhook_signing_secret_here
LOCAL_STORAGE_PATH=./storage/signed_contracts

3. Thiết kế Quy trình Ký tuần tự (Sequential Signing Workflow)

Hệ thống triển khai logic ký theo thứ tự để đảm bảo tính chặt chẽ của hợp đồng.

1. Khởi tạo yêu cầu ký (POST Request):

- Sử dụng định dạng multipart/form-data để gửi tệp PDF.
- Thiết lập signing_order cho Shop là 1 và KOL là 2.
- Nên ưu tiên tệp PDF để SignQuick có thể dự đoán vị trí các trường ký tốt nhất.

2. Lưu trữ định danh (Persistent Mapping):

- Ngay sau khi nhận phản hồi từ API, hệ thống phải lưu trữ document_id vào cơ sở dữ liệu nội bộ gắn với bản ghi hợp đồng tương ứng. Bước này cực kỳ quan trọng để đối chiếu dữ liệu khi Webhook gửi thông báo về.

3. Theo dõi trạng thái:

- Sử dụng document_id để truy vấn trạng thái nếu cần, nhưng ưu tiên sử dụng Webhook để tối ưu tài nguyên.

4. Cơ chế Webhook & Bảo mật Endpoint

Webhook là thành phần then chốt để cập nhật trạng thái thời gian thực mà không cần Polling liên tục (tiết kiệm Rate Limit).

Yêu cầu Kỹ thuật

- Endpoint: Phải sử dụng giao thức https để đảm bảo an toàn dữ liệu trên đường truyền.
- Các sự kiện quan trọng:
  - document.signed: Một bên đã ký.
  - document.completed: Tất cả các bên (Shop & KOL) đã ký xong.
  - document.declined: Một bên từ chối ký, cần cập nhật trạng thái hủy hợp đồng ngay lập tức.

Xác thực chữ ký (Signature Validation)

Để ngăn chặn các cuộc tấn công giả mạo (spoofing), AI Coding Agent phải triển khai logic kiểm tra HMAC-SHA256.

- SignQuick sẽ gửi một mã hash trong header (ví dụ: x-signquick-signature).
- Hệ thống nội bộ cần tính toán mã hash từ payload nhận được bằng SIGNQUICK_WEBHOOK_SECRET và so sánh với giá trị trong header. Chỉ xử lý yêu cầu nếu hai giá trị khớp nhau.

5. Chiến lược Lưu trữ & Xử lý Giới hạn 7 ngày

Cảnh báo: Đối với gói miễn phí, SignQuick chỉ lưu trữ tài liệu trong 7 ngày. Sau thời gian này, dữ liệu sẽ bị xóa vĩnh viễn khỏi server của họ.

Quy trình xử lý bắt buộc sau khi nhận sự kiện document.completed:

1. Tải xuống đồng bộ: Thực hiện GET request để lấy đồng thời:

- File PDF đã ký: Tài liệu cuối cùng có đầy đủ chữ ký các bên.
- Chứng chỉ hoàn tất (Audit Trail/Certificate of Completion): Bằng chứng pháp lý quan trọng ghi lại lịch sử IP, thời gian và thiết bị ký.

2. Chuyển đổi lưu trữ: Tải tệp lên AWS S3, Google Cloud Storage hoặc hệ thống lưu trữ nội bộ lâu dài.
3. Cập nhật DB: Cập nhật đường dẫn lưu trữ mới vào cơ sở dữ liệu và đánh dấu trạng thái "Archived" để hệ thống không cần truy cập vào API SignQuick cho tài liệu này nữa.

4. Xử lý Lỗi & Tối ưu hóa Rate Limit

Hệ thống cần được thiết kế để chịu lỗi (fault-tolerant) với các mã lỗi HTTP phổ biến:

- 401 Unauthorized: Sai API Key hoặc key hết hạn.
- 404 Not Found: document_id không tồn tại hoặc đã bị xóa (sau 7 ngày).
- 429 Too Many Requests: Đã vượt ngưỡng 100 req/min.
  - Giải pháp: Triển khai cơ chế Exponential Backoff (Thử lại sau 1s, 2s, 4s, 8s...) để tự động phục hồi.
- 500 Server Error: Lỗi từ phía SignQuick, cần ghi log chi tiết để theo dõi.

7. Prompt mẫu dành cho AI Coding Agent

Sử dụng prompt dưới đây để yêu cầu AI (Cursor, Copilot, Claude) tạo mã nguồn triển khai:

Đóng vai một Senior Systems Engineer, hãy viết module Node.js (Express + Axios) để tích hợp API SignQuick:

1. Hàm `createSignatureRequest()`:
   - Gửi file PDF bằng `multipart/form-data`.
   - Thiết lập ký tuần tự: Shop (order 1) và KOL (order 2).
   - Lấy `SIGNQUICK_API_KEY` từ biến môi trường.
   - Lưu `document_id` vào DB ngay sau khi khởi tạo thành công.

2. Hàm `handleSignQuickWebhook()`:
   - Endpoint HTTPS để nhận sự kiện.
   - Bắt buộc xác thực HMAC-SHA256 bằng `SIGNQUICK_WEBHOOK_SECRET` từ header để đảm bảo an toàn.
   - Khi nhận `document.completed`, tìm record trong DB dựa trên `document_id` khớp với payload và kích hoạt hàm download.

3. Hàm `downloadAndArchive()`:
   - Tải cả File PDF đã ký và Chứng chỉ hoàn tất (Audit Trail).
   - Lưu trữ vào thư mục cấu hình sẵn và cập nhật đường dẫn vào DB.

Yêu cầu kỹ thuật:

- Triển khai Exponential Backoff cho lỗi 429.
- Sử dụng async/await và xử lý try-catch chặt chẽ.
- Không hardcode thông tin nhạy cảm.

8. Danh mục Kiểm tra Hoàn tất (Integration Checklist)

- [ ] Bảo mật Key: Kiểm tra API Key và Webhook Secret đã nằm trong .env, không nằm trong code.
- [ ] Cấu hình Webhook: Đã đăng ký URL (phải là https) trên dashboard SignQuick.
- [ ] Xác thực HMAC: Kiểm tra logic so khớp mã hash giữa Header và Payload đã hoạt động.
- [ ] Lưu trữ nội bộ: Đảm bảo hệ thống tự động tải PDF và Audit Trail về thành công trước thời hạn 7 ngày.
- [ ] Thứ tự ký: Test thực tế luồng ký để đảm bảo KOL chỉ nhận được thông báo sau khi Shop đã ký.
- [ ] Hạn mức: Theo dõi số lượng tài liệu đã ký để không vượt quá 5 tài liệu/tháng của gói Free trong giai đoạn Production.
