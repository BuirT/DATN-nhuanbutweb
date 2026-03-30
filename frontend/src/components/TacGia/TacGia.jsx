import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Nhúng động cơ thông báo
import "./TacGia.css";

// Danh sách 63 Tỉnh/Thành phố Việt Nam (Xếp theo A-Z)
const danhSachTinhThanh = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bạc Liêu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Cần Thơ",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "TP. Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

function TacGia() {
  const [danhSachTacGia, setDanhSachTacGia] = useState([]);
  const [isEditing, setIsEditing] = useState(null);

  const [formData, setFormData] = useState({
    maTacGia: "",
    hoTen: "",
    butDanh: "",
    loaiTacGia: "CTV",
    khuVuc: "TP. Hồ Chí Minh", // Đặt mặc định theo chuẩn danh sách mới
    dienThoai: "",
  });

  const layDuLieu = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tacgia/danh-sach");
      setDanhSachTacGia(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleXoa = async (id) => {
    if (window.confirm("Đồng chí có chắc chắn muốn xóa tác giả này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tacgia/${id}`);
        toast.success("Đã xóa tác giả thành công! 🗑️");
        layDuLieu();
      } catch (error) {
        toast.error("Lỗi khi xóa tác giả! ❌");
      }
    }
  };

  const handleChonSua = (tacGia) => {
    setIsEditing(tacGia._id);
    setFormData({
      maTacGia: tacGia.maTacGia,
      hoTen: tacGia.hoTen,
      butDanh: tacGia.butDanh || "",
      loaiTacGia: tacGia.loaiTacGia,
      khuVuc: tacGia.khuVuc || "TP. Hồ Chí Minh",
      dienThoai: tacGia.dienThoai || "",
    });
  };

  const handleHuySua = () => {
    setIsEditing(null);
    setFormData({ maTacGia: "", hoTen: "", butDanh: "", loaiTacGia: "CTV", khuVuc: "TP. Hồ Chí Minh", dienThoai: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/tacgia/${isEditing}`, formData);
        toast.success("Cập nhật thông tin thành công! ✨");
      } else {
        await axios.post("http://localhost:5000/api/tacgia/them", formData);
        toast.success("Đã thêm Tác giả mới thành công! 🎉");
      }
      handleHuySua();
      layDuLieu();
    } catch (error) {
      toast.error("Lỗi thao tác! Vui lòng kiểm tra lại. ⚠️");
    }
  };

  return (
    <div className="tacgia-container">
      {/* KHU VỰC FORM NHẬP LIỆU */}
      <div className="form-box" style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#fff", borderLeft: "4px solid #00f2fe", paddingLeft: "10px", marginBottom: "20px" }}>{isEditing ? "🛠️ Cập Nhật Thông Tin Tác Giả" : "Thêm Tác Giả / Phóng Viên Mới"}</h2>

        <form className="form-tacgia" onSubmit={handleSubmit}>
          <input type="text" name="maTacGia" value={formData.maTacGia} onChange={handleChange} placeholder="Mã TG" required />
          <input type="text" name="hoTen" value={formData.hoTen} onChange={handleChange} placeholder="Họ và Tên" required />
          <input type="text" name="butDanh" value={formData.butDanh} onChange={handleChange} placeholder="Bút Danh" />

          <select name="loaiTacGia" value={formData.loaiTacGia} onChange={handleChange}>
            <option value="CTV">Cộng Tác Viên</option>
            <option value="Phóng viên">Phóng Viên</option>
          </select>

          {/* MENU CHỌN TỈNH THÀNH (TỰ ĐỘNG LẶP 63 TỈNH) */}
          <select name="khuVuc" value={formData.khuVuc} onChange={handleChange} required>
            <option value="">-- Chọn Tỉnh / Thành Phố --</option>
            {danhSachTinhThanh.map((tinh, index) => (
              <option key={index} value={tinh}>
                {tinh}
              </option>
            ))}
          </select>

          <input type="text" name="dienThoai" value={formData.dienThoai} onChange={handleChange} placeholder="Số điện thoại" />

          <div style={{ display: "flex", gap: "10px", flex: 1, minWidth: "150px" }}>
            <button type="submit" className="btn-luu" style={{ flex: 1 }}>
              {isEditing ? "Lưu Thay Đổi" : "Lưu Tác Giả"}
            </button>
            {isEditing && (
              <button type="button" onClick={handleHuySua} style={{ backgroundColor: "#64748b", flex: 1 }}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* KHU VỰC BẢNG DANH SÁCH */}
      <h3 style={{ color: "#e2e8f0", marginBottom: "15px" }}>Danh sách Tác giả / Phóng viên</h3>

      <div style={{ overflowX: "auto", backgroundColor: "#121827", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
        <table className="bang-tacgia">
          <thead>
            <tr>
              <th>Mã TG</th>
              <th>Họ Tên</th>
              <th>Bút Danh</th>
              <th>Loại</th>
              <th>Khu Vực</th>
              <th>Điện Thoại</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {danhSachTacGia.map((tacGia) => (
              <tr key={tacGia._id}>
                <td style={{ fontWeight: "bold", color: "#38bdf8" }}>{tacGia.maTacGia}</td>
                <td style={{ color: "#f8fafc", fontWeight: "600" }}>{tacGia.hoTen}</td>
                <td>{tacGia.butDanh}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: tacGia.loaiTacGia === "Phóng viên" ? "rgba(56, 189, 248, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: tacGia.loaiTacGia === "Phóng viên" ? "#38bdf8" : "#10b981",
                      padding: "4px 8px",
                      borderRadius: "5px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {tacGia.loaiTacGia}
                  </span>
                </td>
                <td style={{ fontStyle: "italic", color: "#94a3b8" }}>{tacGia.khuVuc || "Chưa phân loại"}</td>
                <td>{tacGia.dienThoai}</td>
                <td>
                  <button onClick={() => handleChonSua(tacGia)} title="Sửa thông tin" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>
                    ✏️
                  </button>
                  <button onClick={() => handleXoa(tacGia._id)} title="Xóa tác giả" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", marginLeft: "10px" }}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {danhSachTacGia.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                  Chưa có dữ liệu tác giả
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TacGia;
