# VBNA Chapter 11 — Website V6

Bản nâng cấp ngày 17/09/2026, dựa trên mã nguồn V5 và file Excel 132 đầu mục người dùng đã bổ sung. Mã nguồn V5 gốc và file Excel không bị sửa.

## Mở website

1. Mở thư mục `Website_V6`.
2. Nhấp đúp `MO_WEBSITE.command`. Giữ cửa sổ chạy này mở khi dùng web.
3. Trình duyệt mở tại `http://127.0.0.1:8080/index.html`.
4. Nếu cổng 8080 đã có bản web cũ đang chạy, đóng cửa sổ chạy bản cũ rồi mở lại.

Tài khoản chạy thử:

| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| Admin | admin | Admin123 |
| Chủ tịch | chutich | ChuTich123 |
| Thư ký | thuky | ThuKy123 |
| Hội viên | 0978219198 | Member123 |

Hội viên đổi mật khẩu ở lần đăng nhập đầu. Dữ liệu và tài khoản trong bộ gốc là dữ liệu chạy thử, chưa phải danh sách chính thức đã kiểm chứng.

## Những nơi cần xem

- **Trang chủ:** nền sáng, đỏ tươi, hai logo, Hội đồng Sáng lập, 9 Ban, danh bạ lọc theo ngành nghề/Power Team, ngành nghề đang mở.
- **Cài đặt:** logo/ảnh trang chủ, giới thiệu, slogan, liên hệ, 3 nhân sự HĐSL, phân công 9 Ban, thứ tự, Power Team, album, YouTube, tên miền, email dự kiến, nhiệm kỳ và quyền tài khoản.
- **Dashboard các Ban:** báo cáo Phó Chủ tịch, khách mời/CRM, đào tạo có đánh giá, thông báo theo đối tượng, phát triển Power Team.
- **Cổng hội viên:** đề nghị sửa hồ sơ, cơ hội nhận/trao, số điện thoại người trao, xác nhận tiền thực nhận hoặc lý do thất bại, phí của mình.
- **Tài chính:** nghĩa vụ phí, chia bill, phí mới/tái phí/tri ân, thu một phần, tự sinh phiếu thu, chứng từ, sổ quỹ, khóa tháng, tài trợ, bản nháp email nhắc phí.
- **Báo cáo:** lọc tuần/tháng/quý/năm/nhiệm kỳ hoặc ngày tùy chọn, báo cáo điểm danh và tổng hợp tuần, xuất nhiều sheet `.xlsx`, in/Lưu PDF.
- **Meeting:** link gắn mã buổi họp, QR cục bộ và bố cục in.
- **Lucky Draw:** ảnh nền phủ màn hình, logo không kèm chữ, không trùng người trúng theo ID/SĐT, YouTube theo link đã cung cấp và nút phát/tạm dừng.

## Quy tắc đã áp dụng

- Điểm danh hội viên cần ảnh hiện diện; buổi họp phải đang mở. Báo cáo bắt đầu 13:30, sau 14:00 là muộn. Nghỉ ốm, đi thay, về sớm được Ban Phó Chủ tịch ghi nhận kèm lý do.
- Cơ hội dự kiến và doanh thu xác nhận lưu riêng. Chỉ người nhận là hội viên được xác nhận số tiền; không bấm lặp để cộng thêm.
- Doanh thu tuần trước lấy cơ hội trao trong 7 ngày trước buổi họp và được xác nhận trong cùng khoảng đó. Cộng dồn dùng số dư do Phó Chủ tịch nhập cộng xác nhận phát sinh từ ngày cấu hình.
- Phí mới 4.500.000đ, tái phí 3.000.000đ. Tri ân luôn lấy tỷ lệ nhân 3.000.000đ. Ví dụ 10% phí mới: 4.500.000 − 300.000 = 4.200.000đ.
- Chia bill làm tròn đến đồng; phần dư phân cho các người đầu danh sách để tổng nghĩa vụ bằng tổng bill.
- Khoản thu do Thư ký lập chờ Chủ tịch/Admin duyệt. Gạch nợ là xác nhận thu và tự sinh phiếu thu. Sửa phiếu cần lịch sử và phê duyệt. Không sửa phiếu ở tháng đã khóa.
- Cam kết tài trợ không được tính là tiền đã nhận. Xác nhận nhận tài trợ mới tạo phiếu thu.
- Thông báo quan trọng đã duyệt chỉ hiện một lần trong phiên trình duyệt cho từng tài khoản/khách.
- Đánh giá hội viên dùng ngưỡng hiện diện/số cơ hội do quản trị cấu hình; không suy diễn “năng lượng” hay phẩm chất cá nhân.

## Phạm vi và phần còn thiếu

**Đây là bản chạy thử trên máy, chưa phải hệ thống production nhiều người dùng.** Dữ liệu nghiệp vụ ở LocalStorage; chứng từ ở IndexedDB. Phân quyền giao diện không thay thế kiểm soát truy cập phía máy chủ. Không dùng bản này lưu CCCD/tài chính thật trên website công khai.

Chưa có cấu hình máy chủ trong tài liệu cung cấp, nên các phần sau **chưa triển khai/kết nối**:

1. PostgreSQL/Supabase dùng chung, đăng nhập/phân quyền phía máy chủ, private storage và sao lưu máy chủ.
2. Gửi thư thật qua `bnachapter11@gmail.com` và AI sinh nội dung. Email nhắc phí hiện là bản nháp theo mẫu có thể sửa; lưu không gửi email.
3. Đưa web lên `vbna.chapter11.com`, DNS/HTTPS. QR dùng tên miền cấu hình; điện thoại chỉ dùng được sau khi tên miền có bản triển khai và dữ liệu chung.
4. Kiểm tra YouTube thực tế cần internet và video cho phép nhúng; trình duyệt có thể yêu cầu bấm phát. Kiểm thử tự động không đánh giá âm thanh YouTube.
5. Giới thiệu VBNA/Chapter 11, logo/ảnh chính thức, 3 HĐSL và danh sách LT/hội viên chính thức chưa được cung cấp đầy đủ. Cập nhật tại Cài đặt. Tên 5 Power Team kế thừa V5, có thể sửa; Excel mới chỉ nêu rõ 3 nhóm và còn dang dở.

Các đầu mục kế thừa V5 không đồng nghĩa đã được nghiệm thu production. V5 chưa đầy đủ import Excel, ngân sách/quyết toán sự kiện và mọi quy trình nâng cao; xem `DOI_CHIEU_YEU_CAU.md`.

## Dữ liệu khi nâng cấp

V6 dùng lại khóa V5 (`c11_erp_v5`), bổ sung cấu trúc và giữ bản sao trước nâng cấp (`c11_backup_before_v6`). Chỉ áp dụng khi mở trên **cùng địa chỉ trình duyệt**. Không xóa dữ liệu trình duyệt nếu còn cần hồ sơ/tệp. Sao lưu JSON trong Cài đặt chưa bao gồm file IndexedDB.

## Bảo trì

`src/legacy-app.js` là nền V5. Các file trong `src/` là phần V6; `build.py` tạo `app.js`. Sửa file nguồn rồi chạy build. `database_schema.sql` là thiết kế V5, không phải migration đã triển khai cho V6.

Thư viện QR: qrcode-generator (MIT), https://github.com/kazuhikoarase/qrcode-generator. JSZip: https://stuk.github.io/jszip/ (MIT hoặc GPLv3). YouTube IFrame API: https://developers.google.com/youtube/iframe_api_reference.
