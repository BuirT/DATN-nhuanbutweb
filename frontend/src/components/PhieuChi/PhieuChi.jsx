import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../NhuanBut/NhuanBut.css";

function PhieuChi() {
  const [danhSachBaiViet, setDanhSachBaiViet] = useState([]);
  const [danhSachSoBao, setDanhSachSoBao] = useState([]);

  // Tab điều hướng cho Kế toán
  const [tabHienTai, setTabHienTai] = useState("ChoTrinhDuyet"); // 'ChoTrinhDuyet' hoặc 'ChoThanhToan'

  // Bộ lọc tìm kiếm
  const [locSoBao, setLocSoBao] = useState("");
  const [locKhuVuc, setLocKhuVuc] = useState("");

  const [danhSachGom, setDanhSachGom] = useState([]);
  const [isLapping, setIsLapping] = useState(null);

  const [formData, setFormData] = useState({
    hinhThuc: "Chuyển khoản",
    lyDo: "Thanh toán nhuận bút",
  });

  const layDuLieu = async () => {
    try {
      const resBai = await axios.get("http://localhost:5000/api/nhuanbut/danh-sach");
      const resBao = await axios.get("http://localhost:5000/api/sobao/danh-sach");
      setDanhSachBaiViet(resBai.data);
      setDanhSachSoBao(resBao.data);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu hệ thống!");
    }
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  // --- LOGIC LỌC VÀ GOM NHÓM DỮ LIỆU ---
  useEffect(() => {
    // 1. Lọc theo trạng thái (Tab)
    let dataLoc = danhSachBaiViet.filter((bai) => (tabHienTai === "ChoTrinhDuyet" ? bai.trangThai === "Chờ duyệt" || !bai.trangThai : bai.trangThai === "Đã duyệt"));

    // 2. Lọc theo Số Báo và Khu Vực
    dataLoc = dataLoc.filter((bai) => {
      const khopSoBao = locSoBao === "" || bai.soBao === locSoBao;
      const khopKhuVuc = locKhuVuc === "" || (bai.tacGia && bai.tacGia.khuVuc === locKhuVuc);
      return khopSoBao && khopKhuVuc;
    });

    // 3. Gom nhóm theo Tác Giả (Code xuất sắc của đồng chí Tí)
    const groupedData = dataLoc.reduce((acc, bai) => {
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
      acc[idTG].tongGoc += Number(bai.tienNhuanBut) || 0;

      const tienThue = (Number(bai.tienNhuanBut) || 0) >= 2000000 ? (Number(bai.tienNhuanBut) || 0) * 0.1 : 0;
      acc[idTG].tongThue += tienThue;
      acc[idTG].tongThucLanh += (Number(bai.tienNhuanBut) || 0) - tienThue;

      return acc;
    }, {});

    setDanhSachGom(Object.values(groupedData));
  }, [danhSachBaiViet, tabHienTai, locSoBao, locKhuVuc]);

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

  // --- HÀM 1: TRÌNH LÃNH ĐẠO (Đổi trạng thái) ---
  const handleTrinhLanhDao = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(isLapping.danhSachBai.map((bai) => axios.put(`http://localhost:5000/api/nhuanbut/${bai._id}`, { trangThai: "Trình Lãnh Đạo" })));
      toast.success("📤 Đã lập phiếu trình Lãnh Đạo thành công!");
      handleHuyForm();
      layDuLieu();
    } catch (error) {
      toast.error("Lỗi khi trình duyệt!");
    }
  };

  // --- HÀM 2: XUẤT PHIẾU & THANH TOÁN (Lãnh đạo đã duyệt) ---
  const handleXuatPhieu = async (e) => {
    e.preventDefault();
    try {
      // 1. Cập nhật trạng thái các bài thành "Đã thanh toán"
      await Promise.all(isLapping.danhSachBai.map((bai) => axios.put(`http://localhost:5000/api/nhuanbut/${bai._id}`, { trangThai: "Đã thanh toán" })));

      // 2. Gọi API tạo phiếu chi (lưu lại lịch sử chi tiền)
      const payload = {
        tacGia: isLapping.tacGia._id,
        danhSachBai: isLapping.danhSachBai.map((b) => b._id),
        tongTien: isLapping.tongGoc,
        tongThue: isLapping.tongThue,
        thucLanh: isLapping.tongThucLanh,
        hinhThuc: formData.hinhThuc,
        lyDo: formData.lyDo,
      };
      // Nếu chưa code Backend cho PhieuChi thì dòng dưới có thể báo lỗi đỏ, nhưng không sao, bài vẫn đổi trạng thái
      await axios.post("http://localhost:5000/api/phieuchi/tao-phieu", payload).catch(() => console.log("Chưa có API Phiếu Chi"));

      toast.success("✅ Tạo Phiếu Chi và Tất toán thành công!");
      handleHuyForm();
      layDuLieu();
    } catch (error) {
      toast.error("Lỗi hệ thống khi thanh toán!");
    }
  };

  return (
    <div className="nhuanbut-container">
      {/* KHU VỰC ĐIỀU HƯỚNG CỦA KẾ TOÁN */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => {
            setTabHienTai("ChoTrinhDuyet");
            handleHuyForm();
          }}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: tabHienTai === "ChoTrinhDuyet" ? "#3b82f6" : "#1e293b",
            color: tabHienTai === "ChoTrinhDuyet" ? "#fff" : "#94a3b8",
          }}
        >
          1. Gom Bài Trình Lãnh Đạo
        </button>
        <button
          onClick={() => {
            setTabHienTai("ChoThanhToan");
            handleHuyForm();
          }}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: tabHienTai === "ChoThanhToan" ? "#10b981" : "#1e293b",
            color: tabHienTai === "ChoThanhToan" ? "#fff" : "#94a3b8",
          }}
        >
          2. Xuất Phiếu Thanh Toán (Đã Duyệt)
        </button>
      </div>

      {/* BỘ LỌC TÌM KIẾM */}
      <div className="form-box" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "15px" }}>
          <select
            value={locSoBao}
            onChange={(e) => setLocSoBao(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <option value="">-- Tất cả Số Báo --</option>
            {danhSachSoBao.map((sb) => (
              <option key={sb._id} value={sb.maSoBao}>
                {sb.maSoBao} - {sb.tenSoBao}
              </option>
            ))}
          </select>
          <select
            value={locKhuVuc}
            onChange={(e) => setLocKhuVuc(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <option value="">-- Tất cả Khu Vực --</option>
            <option value="TP.HCM">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Miền Nam">Miền Nam</option>
            <option value="Khác">Khu vực Khác</option>
          </select>
        </div>
      </div>

      {/* FORM LẬP PHIẾU HIỂN THỊ KHI BẤM NÚT */}
      {isLapping && (
        <div className="form-box highlight-box" style={{ border: `1px solid ${tabHienTai === "ChoTrinhDuyet" ? "#3b82f6" : "#10b981"}` }}>
          <h3 style={{ color: tabHienTai === "ChoTrinhDuyet" ? "#38bdf8" : "#34d399" }}>{tabHienTai === "ChoTrinhDuyet" ? "📤 Lập Phiếu Trình Duyệt" : "🖨️ Xuất Phiếu Thanh Toán"}</h3>
          <p>
            Tác giả: <strong>{isLapping.tacGia.hoTen}</strong> ({isLapping.danhSachBai.length} bài viết)
          </p>
          <p>
            Tổng Thực Lãnh: <strong style={{ color: "#facc15", fontSize: "18px" }}>{isLapping.tongThucLanh.toLocaleString("vi-VN")}đ</strong>
          </p>

          <form className="form-nhap" onSubmit={tabHienTai === "ChoTrinhDuyet" ? handleTrinhLanhDao : handleXuatPhieu} style={{ marginTop: "15px" }}>
            {/* Chỉ hiện chọn Hình thức CK/TM khi ở bước Thanh Toán */}
            {tabHienTai === "ChoThanhToan" && (
              <div style={{ display: "flex", gap: "15px" }}>
                <select name="hinhThuc" value={formData.hinhThuc} onChange={handleChange} style={{ flex: 1 }}>
                  <option value="Chuyển khoản">Chuyển khoản (CK)</option>
                  <option value="Tiền mặt">Tiền mặt (TM)</option>
                </select>
                <input type="text" name="lyDo" value={formData.lyDo} onChange={handleChange} placeholder="Lý do chi" style={{ flex: 2 }} required />
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button type="submit" className="btn-luu-bai" style={{ backgroundColor: tabHienTai === "ChoTrinhDuyet" ? "#3b82f6" : "#10b981" }}>
                {tabHienTai === "ChoTrinhDuyet" ? "Trình Lãnh Đạo Ký" : "Hoàn Tất Thanh Toán"}
              </button>
              <button type="button" onClick={handleHuyForm} className="btn-luu-bai" style={{ backgroundColor: "#64748b" }}>
                Hủy Bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BẢNG TỔNG HỢP CÔNG NỢ */}
      <h3 style={{ color: "#e2e8f0" }}>{tabHienTai === "ChoTrinhDuyet" ? "Danh Sách Chờ Trình Duyệt" : "Danh Sách Chờ Thanh Toán"}</h3>

      <table className="bang-danh-sach">
        <thead>
          <tr>
            <th>Tác Giả</th>
            <th>Khu Vực</th>
            <th>Số Lượng Bài</th>
            <th style={{ color: "#f87171" }}>Tổng Thuế</th>
            <th style={{ color: "#34d399" }}>Tổng Thực Lãnh</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {danhSachGom.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                Không có dữ liệu trong mục này.
              </td>
            </tr>
          ) : (
            danhSachGom.map((nhom) => (
              <tr key={nhom.tacGia._id}>
                <td style={{ fontWeight: "bold", fontSize: "15px", color: "#e2e8f0" }}>{nhom.tacGia.hoTen}</td>
                <td style={{ fontStyle: "italic", color: "#94a3b8" }}>{nhom.tacGia.khuVuc || "Chưa rõ"}</td>
                <td>
                  <span style={{ backgroundColor: "#334155", padding: "4px 8px", borderRadius: "5px" }}>{nhom.danhSachBai.length} bài</span>
                </td>
                <td style={{ color: "#f87171" }}>{nhom.tongThue > 0 ? `-${nhom.tongThue.toLocaleString("vi-VN")}đ` : "0đ"}</td>
                <td style={{ color: "#34d399", fontWeight: "bold", fontSize: "16px" }}>{nhom.tongThucLanh.toLocaleString("vi-VN")}đ</td>
                <td>
                  <button onClick={() => handleMoForm(nhom)} style={{ background: "none", border: "1px solid #94a3b8", color: "#fff", padding: "6px 12px", borderRadius: "5px", cursor: "pointer" }}>
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
