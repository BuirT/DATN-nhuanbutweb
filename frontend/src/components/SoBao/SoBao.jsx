import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./SoBao.css";

function SoBao() {
  const [danhSachSoBao, setDanhSachSoBao] = useState([]);
  const [isEditing, setIsEditing] = useState(null);

  const [formData, setFormData] = useState({
    maSoBao: "",
    tenSoBao: "",
    ngayPhatHanh: "",
    loaiBao: "Báo In",
    nganSach: "",
  });

  const layDuLieu = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sobao/danh-sach");
      setDanhSachSoBao(response.data);
    } catch (error) {
      console.error("Chưa có API Backend, dữ liệu tạm thời trống.");
    }
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleXoa = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Số báo này? Các bài viết thuộc số báo này có thể bị ảnh hưởng!")) {
      try {
        await axios.delete(`http://localhost:5000/api/sobao/${id}`);
        toast.success("Đã xóa Số báo thành công!");
        layDuLieu();
      } catch (error) {
        toast.error("Lỗi khi xóa!");
      }
    }
  };

  const handleChonSua = (bao) => {
    setIsEditing(bao._id);
    setFormData({
      maSoBao: bao.maSoBao,
      tenSoBao: bao.tenSoBao,
      ngayPhatHanh: bao.ngayPhatHanh ? bao.ngayPhatHanh.substring(0, 10) : "",
      loaiBao: bao.loaiBao || "Báo In",
      nganSach: bao.nganSach != null && bao.nganSach !== "" ? String(bao.nganSach) : "",
    });
  };

  const handleHuySua = () => {
    setIsEditing(null);
    setFormData({ maSoBao: "", tenSoBao: "", ngayPhatHanh: "", loaiBao: "Báo In", nganSach: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/sobao/${isEditing}`, {
          ...formData,
          nganSach: formData.nganSach === "" ? 0 : Number(formData.nganSach),
        });
        toast.success("Cập nhật Số báo thành công!");
      } else {
        await axios.post("http://localhost:5000/api/sobao/them", {
          ...formData,
          nganSach: formData.nganSach === "" ? 0 : Number(formData.nganSach),
        });
        toast.success("Đã phát hành Số báo mới!");
      }
      handleHuySua();
      layDuLieu();
    } catch (error) {
      toast.error("Lỗi thao tác! Vui lòng kiểm tra lại. ⚠️");
    }
  };

  return (
    <div className="sobao-container">
      <div className="form-box">
        <h3>{isEditing ? "Sửa thông tin số báo" : "Phát hành số báo mới"}</h3>
        <form className="form-nhap" onSubmit={handleSubmit}>
          <input type="text" name="maSoBao" value={formData.maSoBao} onChange={handleChange} placeholder="Mã Số Báo (VD: B01)" required />
          <input className="input-stretch" type="text" name="tenSoBao" value={formData.tenSoBao} onChange={handleChange} placeholder="Tên Số Báo (VD: Tuổi Trẻ Cuối Tuần)" required />

          <div className="sobao-row-dates">
            <input type="date" name="ngayPhatHanh" value={formData.ngayPhatHanh} onChange={handleChange} required title="Ngày Phát Hành" />
            <select name="loaiBao" value={formData.loaiBao} onChange={handleChange}>
              <option value="Báo In">Báo In</option>
              <option value="Báo Điện Tử">Báo Điện Tử</option>
              <option value="Tạp Chí">Tạp Chí</option>
            </select>
          </div>

          <input
            className="input-full-width"
            type="number"
            name="nganSach"
            value={formData.nganSach}
            onChange={handleChange}
            placeholder="Ngân sách nhuận bút kỳ này (VNĐ, tùy chọn)"
            min="0"
            title="Dùng để cảnh báo vượt ngân sách ở màn Nhập nhuận bút"
          />

          <div className="sobao-actions">
            <button type="submit" className="btn-luu-bao">
              {isEditing ? "Lưu cập nhật" : "Tạo số báo"}
            </button>
            {isEditing && (
              <button type="button" onClick={handleHuySua} className="btn-luu-bao btn-luu-bao--muted">
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="sobao-section-title">Danh sách kỳ báo đã phát hành</h3>
      <div className="sobao-table-wrap">
      <table className="bang-danh-sach">
        <thead>
          <tr>
            <th>Mã Số</th>
            <th>Tên Số Báo</th>
            <th>Ngày Phát Hành</th>
            <th>Loại Báo</th>
            <th>Ngân sách (VNĐ)</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {danhSachSoBao.length === 0 ? (
            <tr>
                <td colSpan="6" className="table-empty">
                  Chưa có dữ liệu Số báo.
                </td>
            </tr>
          ) : (
            danhSachSoBao.map((bao) => (
              <tr key={bao._id}>
                <td className="sobao-code">{bao.maSoBao}</td>
                <td>{bao.tenSoBao}</td>
                <td>{new Date(bao.ngayPhatHanh).toLocaleDateString("vi-VN")}</td>
                <td>
                  <span className="badge-loai">{bao.loaiBao}</span>
                </td>
                <td>{Number(bao.nganSach) > 0 ? Number(bao.nganSach).toLocaleString("vi-VN") : "—"}</td>
                <td>
                  <button onClick={() => handleChonSua(bao)}>✏️</button>
                  <button onClick={() => handleXoa(bao._id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default SoBao;
