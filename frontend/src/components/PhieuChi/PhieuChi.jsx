import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./PhieuChi.css";

function PhieuChi() {
  const [danhSachGom, setDanhSachGom] = useState([]);
  const [isLapping, setIsLapping] = useState(null); // Lưu tác giả đang được lập phiếu

  const [formData, setFormData] = useState({
    hinhThuc: "Chuyển khoản",
    lyDo: "Thanh toán nhuận bút",
  });

  const layDuLieuDuyet = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/nhuanbut/danh-sach");
      // Chỉ lấy những bài "Đã duyệt"
      const baiDaDuyet = res.data.filter((bai) => bai.trangThai === "Đã duyệt");

      // --- THUẬT TOÁN GOM NHÓM THEO TÁC GIẢ ---
      const groupedData = baiDaDuyet.reduce((acc, bai) => {
        const idTG = bai.tacGia?._id;
        if (!idTG) return acc;

        if (!acc[idTG]) {
          acc[idTG] = {
            tacGia: bai.tacGia,
            danhSachBai: [],
            tongGoc: 0,
            tongThue: 0,
            tongThucLanh: 0,
          };
        }
        acc[idTG].danhSachBai.push(bai);
        acc[idTG].tongGoc += bai.tienNhuanBut || 0;
        acc[idTG].tongThue += bai.thue || 0;
        acc[idTG].tongThucLanh += bai.thucLanh || bai.tienNhuanBut || 0;

        return acc;
      }, {});

      setDanhSachGom(Object.values(groupedData));
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    layDuLieuDuyet();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMoForm = (nhom) => {
    setIsLapping(nhom);
  };

  const handleHuyForm = () => {
    setIsLapping(null);
    setFormData({ hinhThuc: "Chuyển khoản", lyDo: "Thanh toán nhuận bút" });
  };

  const handleXuatPhieu = async (e) => {
    e.preventDefault();
    try {
      // Chuẩn bị dữ liệu gửi xuống Backend
      const payload = {
        tacGia: isLapping.tacGia._id,
        danhSachBai: isLapping.danhSachBai.map((b) => b._id),
        tongTien: isLapping.tongGoc,
        tongThue: isLapping.tongThue,
        thucLanh: isLapping.tongThucLanh,
        hinhThuc: formData.hinhThuc,
        lyDo: formData.lyDo,
      };

      // Gọi API lập phiếu chi (Anh em mình sẽ viết Backend sau)
      await axios.post("http://localhost:5000/api/phieuchi/tao-phieu", payload);

      toast.success("Tạo Phiếu Chi thành công! Đã tất toán cho tác giả 🖨️");
      handleHuyForm();
      layDuLieuDuyet(); // Load lại bảng
    } catch (error) {
      toast.error("Lỗi khi tạo phiếu chi (Chưa có API Backend) ⚠️");
    }
  };

  return (
    <div className="phieuchi-container">
      {/* FORM LẬP PHIẾU HIỂN THỊ KHI BẤM NÚT */}
      {isLapping && (
        <div className="form-box highlight-box">
          <h3 style={{ color: "#facc15" }}>🖨️ Lập Phiếu Chi Thanh Toán</h3>
          <p>
            Tác giả: <strong>{isLapping.tacGia.hoTen}</strong> ({isLapping.danhSachBai.length} bài viết)
          </p>
          <p>
            Tổng Thực Lãnh: <strong style={{ color: "#34d399", fontSize: "18px" }}>{isLapping.tongThucLanh.toLocaleString("vi-VN")}đ</strong>
          </p>

          <form className="form-nhap" onSubmit={handleXuatPhieu} style={{ marginTop: "15px" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <select name="hinhThuc" value={formData.hinhThuc} onChange={handleChange} style={{ flex: 1 }}>
                <option value="Chuyển khoản">Chuyển khoản (CK)</option>
                <option value="Tiền mặt">Tiền mặt (TM)</option>
              </select>
              <input type="text" name="lyDo" value={formData.lyDo} onChange={handleChange} placeholder="Lý do chi" style={{ flex: 2 }} required />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button type="submit" className="btn-xuat-phieu">
                Xuất Phiếu Chi
              </button>
              <button type="button" onClick={handleHuyForm} className="btn-xuat-phieu" style={{ backgroundColor: "#64748b" }}>
                Hủy Bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BẢNG TỔNG HỢP CÔNG NỢ */}
      <h2>Danh Sách Chờ Lập Phiếu Chi (Đã Duyệt)</h2>
      <table className="bang-duyet">
        <thead>
          <tr>
            <th>Tác Giả</th>
            <th>Số Lượng Bài</th>
            <th>Tổng Tiền Gốc</th>
            <th style={{ color: "#f87171" }}>Tổng Thuế</th>
            <th style={{ color: "#34d399" }}>Tổng Thực Lãnh</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {danhSachGom.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                Hiện không có khoản nào cần chi trả.
              </td>
            </tr>
          ) : (
            danhSachGom.map((nhom) => (
              <tr key={nhom.tacGia._id}>
                <td style={{ fontWeight: "bold", fontSize: "15px", color: "#e2e8f0" }}>{nhom.tacGia.hoTen}</td>
                <td>
                  <span className="badge-so-luong">{nhom.danhSachBai.length} bài</span>
                </td>
                <td>{nhom.tongGoc.toLocaleString("vi-VN")}đ</td>
                <td style={{ color: "#f87171" }}>{nhom.tongThue > 0 ? `-${nhom.tongThue.toLocaleString("vi-VN")}đ` : "0đ"}</td>
                <td style={{ color: "#34d399", fontWeight: "bold", fontSize: "16px" }}>{nhom.tongThucLanh.toLocaleString("vi-VN")}đ</td>
                <td>
                  <button className="btn-lap-phieu" onClick={() => handleMoForm(nhom)}>
                    Lập Phiếu
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PhieuChi;
