import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./NhuanBut.css";

function NhuanBut() {
  const [danhSachBaiViet, setDanhSachBaiViet] = useState([]);
  const [danhSachTacGia, setDanhSachTacGia] = useState([]);
  // --- THÊM STATE ĐỂ CHỨA DANH SÁCH SỐ BÁO TỪ BACKEND ---
  const [danhSachSoBao, setDanhSachSoBao] = useState([]);
  const [isEditing, setIsEditing] = useState(null);

  const [formData, setFormData] = useState({
    tenBai: "",
    tacGia: "",
    muc: "",
    tienNhuanBut: "",
    soBao: "",
    ghiChu: "",
  });

  const [thue, setThue] = useState(0);
  const [thucLanh, setThucLanh] = useState(0);

  const layDuLieu = async () => {
    try {
      // Gọi API lấy cả 3 danh sách cùng một lúc
      const resBaiViet = await axios.get("http://localhost:5000/api/nhuanbut/danh-sach");
      setDanhSachBaiViet(resBaiViet.data);

      const resTacGia = await axios.get("http://localhost:5000/api/tacgia/danh-sach");
      setDanhSachTacGia(resTacGia.data);

      const resSoBao = await axios.get("http://localhost:5000/api/sobao/danh-sach");
      setDanhSachSoBao(resSoBao.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "tienNhuanBut") {
      const tienGoc = Number(value) || 0;
      const tienThue = tienGoc >= 2000000 ? tienGoc * 0.1 : 0;
      setThue(tienThue);
      setThucLanh(tienGoc - tienThue);
    }
  };

  const handleXoa = async (id) => {
    if (window.confirm("Đồng chí có chắc chắn muốn xóa bài viết này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/nhuanbut/${id}`);
        toast.success("Đã xóa bài viết khỏi hệ thống! 🗑️");
        layDuLieu();
      } catch (error) {
        toast.error("Lỗi khi xóa bài viết! ❌");
      }
    }
  };

  const handleChonSua = (bai) => {
    setIsEditing(bai._id);
    setFormData({
      tenBai: bai.tenBai,
      tacGia: bai.tacGia?._id || "",
      muc: bai.muc || "",
      tienNhuanBut: bai.tienNhuanBut,
      soBao: bai.soBao || "",
      ghiChu: bai.ghiChu || "",
    });

    const tienGoc = Number(bai.tienNhuanBut) || 0;
    const tienThue = tienGoc >= 2000000 ? tienGoc * 0.1 : 0;
    setThue(tienThue);
    setThucLanh(tienGoc - tienThue);
  };

  const handleHuySua = () => {
    setIsEditing(null);
    setFormData({ tenBai: "", tacGia: "", muc: "", tienNhuanBut: "", soBao: "", ghiChu: "" });
    setThue(0);
    setThucLanh(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/nhuanbut/${isEditing}`, formData);
        toast.success("Cập nhật bài viết thành công! ✨");
      } else {
        await axios.post("http://localhost:5000/api/nhuanbut/nhap-bai", formData);
        toast.success("Thêm bài viết mới thành công! 📝");
      }
      handleHuySua();
      layDuLieu();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu! ⚠️");
    }
  };

  return (
    <div className="nhuanbut-container">
      <div className="form-box">
        <h3 style={{ color: isEditing ? "#2196F3" : "#ffffff" }}>{isEditing ? "🛠️ Sửa Thông Tin Bài Viết" : "📝 Nhập Nhuận Bút & Tính Thuế"}</h3>
        <form className="form-nhap" onSubmit={handleSubmit}>
          <input type="text" name="tenBai" value={formData.tenBai} onChange={handleChange} placeholder="Tên bài viết" required style={{ width: "100%" }} />

          <div style={{ display: "flex", gap: "15px", width: "100%", marginTop: "15px" }}>
            <select name="tacGia" value={formData.tacGia} onChange={handleChange} required style={{ flex: 1 }}>
              <option value="">-- Chọn Tác Giả --</option>
              {danhSachTacGia.map((tg) => (
                <option key={tg._id} value={tg._id}>
                  {tg.hoTen}
                </option>
              ))}
            </select>

            {/* --- ĐÃ ĐỔI THÀNH MENU XỔ XUỐNG CHỌN SỐ BÁO --- */}
            <select name="soBao" value={formData.soBao} onChange={handleChange} required style={{ flex: 1 }}>
              <option value="">-- Chọn Kỳ Báo / Số Báo --</option>
              {danhSachSoBao.map((bao) => (
                <option key={bao._id} value={bao.maSoBao}>
                  {bao.maSoBao} - {bao.tenBao}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "15px", width: "100%", alignItems: "center", marginTop: "15px" }}>
            <input type="number" name="tienNhuanBut" value={formData.tienNhuanBut} onChange={handleChange} placeholder="💰 Nhập Tiền Gốc (VNĐ)" required style={{ flex: 1 }} />

            <div
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "rgba(244, 63, 94, 0.1)",
                color: "#f87171",
                borderRadius: "8px",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              Thuế TNCN (10%): <strong>&nbsp;{thue.toLocaleString()}đ</strong>
            </div>

            <div
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#34d399",
                borderRadius: "8px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                fontSize: "15px",
              }}
            >
              Thực lãnh: <strong style={{ fontSize: "18px" }}>&nbsp;{thucLanh.toLocaleString()}đ</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button type="submit" className="btn-luu-bai">
              {isEditing ? "Cập Nhật Dữ Liệu" : "Lưu Bài & Tính Toán"}
            </button>
            {isEditing && (
              <button type="button" onClick={handleHuySua} className="btn-luu-bai" style={{ backgroundColor: "#64748b" }}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <h3>Bảng Kê Chi Tiết Nhuận Bút</h3>
      <table className="bang-danh-sach">
        <thead>
          <tr>
            <th>Tên Bài</th>
            <th>Tác Giả</th>
            <th>Số Báo</th>
            <th>Tiền Gốc</th>
            <th style={{ color: "#f87171" }}>Thuế (10%)</th>
            <th style={{ color: "#34d399" }}>Thực Lãnh</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {danhSachBaiViet.map((bai) => {
            const tien = Number(bai.tienNhuanBut) || 0;
            const tienThue = tien >= 2000000 ? tien * 0.1 : 0;
            const tienThuc = tien - tienThue;

            return (
              <tr key={bai._id}>
                <td>{bai.tenBai}</td>
                <td>{bai.tacGia?.hoTen}</td>
                <td>
                  <span style={{ fontWeight: "bold", color: "#4facfe" }}>{bai.soBao}</span>
                </td>
                <td style={{ fontWeight: "bold" }}>{tien.toLocaleString()}đ</td>
                <td style={{ color: "#f87171" }}>{tienThue > 0 ? `-${tienThue.toLocaleString()}đ` : "0đ"}</td>
                <td style={{ color: "#34d399", fontWeight: "bold", fontSize: "15px" }}>{tienThuc.toLocaleString()}đ</td>
                <td>
                  <span className={bai.trangThai === "Đã duyệt" ? "badge-xong" : "badge-cho"}>{bai.trangThai}</span>
                </td>
                <td>
                  <button onClick={() => handleChonSua(bai)}>✏️</button>
                  <button onClick={() => handleXoa(bai._id)}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default NhuanBut;
