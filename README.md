# 📰 EDITORIAL DESK - HỆ THỐNG QUẢN LÝ NHUẬN BÚT TÒA SOẠN

Hệ thống **Editorial Desk** là một giải pháp quản lý toàn diện dành cho các tòa soạn báo, giúp số hóa quy trình từ khâu nhập liệu bài viết, tính toán nhuận bút, khấu trừ thuế TNCN đến khâu thanh toán và báo cáo thống kê tài chính.

---

## 🚀 Công Nghệ Sử Dụng

Dự án được xây dựng trên mô hình **MERN Stack** hiện đại, tập trung vào hiệu năng và trải nghiệm người dùng:

- **Frontend:** React.js (Vite), Chart.js (Biểu đồ trực quan), Axios, React-Toastify.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Cloud Atlas) kết hợp Mongoose.
- **Tiện ích tích hợp:** \* `xlsx`: Hỗ trợ xuất báo cáo thống kê ra file Excel.
  - `open-api.vn`: Gọi API thời gian thực lấy dữ liệu 63 tỉnh thành Việt Nam.

---

## ✨ Tính Năng Cốt Lõi

### 1. Dashboard Thống Kê Đa Chiều (Real-time)

- Theo dõi tổng quy mô chi trả, công nợ tồn đọng và tổng thuế thu hộ.
- Phân tích dòng tiền chi trả theo hình thức: **Chuyển khoản (CK)** và **Tiền mặt (TM)**.
- Biểu đồ cột theo dõi nhuận bút chi cho mỗi kỳ báo.
- Biểu đồ tròn phân tích cơ cấu trạng thái hồ sơ.
- Biểu đồ theo dõi hoạt động nhuận bút theo khu vực địa lý.

### 2. Quy Trình Xét Duyệt 4 Bước Chuyên Nghiệp

Hệ thống quản lý trạng thái hồ sơ theo dải màu sắc (Traffic Light) dễ nhận diện:

- 🔴 **Chờ duyệt:** Hồ sơ mới nhập liệu từ Thư ký.
- 🟡 **Trình lãnh đạo:** Đang chờ Ban biên tập / Giám đốc phê duyệt chi.
- 🔵 **Đã duyệt:** Đã thông qua, chờ Kế toán xuất quỹ.
- 🟢 **Đã thanh toán:** Tiền đã được chuyển vào tài khoản tác giả.

### 3. Quản Lý Nhuận Bút & Thuế TNCN

- Tự động tính thuế TNCN dựa trên cấu hình linh hoạt (Mặc định 10% cho bài trên 2.000.000đ).
- Hệ thống cảnh báo vượt ngân sách kỳ báo (Budget Alert) giúp kiểm soát tài chính tự động.
- Tự động gom nhóm bài viết theo Tác giả để lập phiếu chi tổng hợp.

### 4. Quản Lý Tác Giả & Hệ Thống

- Quản lý danh sách Tác giả, Phóng viên, Cộng tác viên.
- Tích hợp API lấy dữ liệu khu vực chuẩn xác.
- Phân quyền người dùng chặt chẽ: Admin, Lãnh đạo, Kế toán, Nhập liệu.

### 5. Công Cụ Hỗ Trợ Kế Toán

- Xuất báo cáo thống kê toàn cảnh tòa soạn ra file **Excel**.
- Tính năng **In bảng kê trình ký** chuẩn format văn phòng (ẩn các thành phần giao diện không cần thiết khi in).

---

## 🌓 Giao Diện (UI/UX)

- Thiết kế đồng bộ, hiện đại với hệ thống Biến CSS (CSS Variables) linh hoạt.
- Hỗ trợ chuyển đổi mượt mà giữa chế độ **Dark Mode** và **Light Mode**.
- Thiết kế Responsive, hiển thị tốt trên nhiều kích thước màn hình.

---

## 🛠 Hướng Dẫn Cài Đặt Khởi Chạy

### 1. Yêu cầu hệ thống

- Node.js đã được cài đặt.
- Có URI kết nối MongoDB Database (Local hoặc Cloud Atlas).

### 2. Cài đặt và khởi chạy Backend

Mở terminal, di chuyển vào thư mục backend và chạy các lệnh sau:

```bash
cd backend
npm install
npm run dev
```
