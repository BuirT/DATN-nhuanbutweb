import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import "./DuyetChi.css";

// DANH SÁCH 63 TỈNH THÀNH (Đồng bộ toàn hệ thống)
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

function DuyetChi() {
  const [danhSachBaiViet, setDanhSachBaiViet] = useState([]);

  // --- STATE CHO BỘ LỌC THÔNG MINH ---
  const [locKhuVuc, setLocKhuVuc] = useState("Tất cả");
  const [locSoBao, setLocSoBao] = useState("Tất cả");
  const tenNguoiDung = localStorage.getItem("hoTen") || "Lãnh Đạo Vô Danh"; 
  const layDuLieu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/nhuanbut/danh-sach");
      // BƯỚC 1: Lãnh đạo chỉ nhìn thấy những bài kế toán đã "Trình Lãnh Đạo"
      const baiTrinhDuyet = res.data.filter((bai) => bai.trangThai === "Trình Lãnh Đạo");
      setDanhSachBaiViet(baiTrinhDuyet);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Lỗi tải dữ liệu trình duyệt!");
    }
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  // Tự động lấy danh sách Số báo từ dữ liệu (vì số báo thì linh động thêm bớt)
  const dsSoBao = ["Tất cả", ...new Set(danhSachBaiViet.map((b) => b.soBao).filter(Boolean))];

  // --- ÁP DỤNG BỘ LỌC VÀO DỮ LIỆU ---
  const danhSachSauLoc = danhSachBaiViet.filter((bai) => {
    const matchKhuVuc = locKhuVuc === "Tất cả" || bai.tacGia?.khuVuc === locKhuVuc;
    const matchSoBao = locSoBao === "Tất cả" || bai.soBao === locSoBao;
    return matchKhuVuc && matchSoBao;
  });

  // --- GOM BÀI SAU LỌC THÀNH TỪNG PHIẾU CHI (Sếp duyệt theo cụm) ---
  const groupedData = danhSachSauLoc.reduce((acc, bai) => {
    const idTG = bai.tacGia?._id;
    if (!idTG) return acc;

    if (!acc[idTG]) {
      acc[idTG] = {
        tacGia: bai.tacGia,
        danhSachBai: [],
        tongThucLanh: 0,
      };
    }
    acc[idTG].danhSachBai.push(bai);

    const tienGoc = Number(bai.tienNhuanBut) || 0;
    const tienThue = tienGoc >= 2000000 ? tienGoc * 0.1 : 0;
    acc[idTG].tongThucLanh += tienGoc - tienThue;

    return acc;
  }, {});

  const danhSachGom = Object.values(groupedData);

  // --- HÀNH ĐỘNG CỦA LÃNH ĐẠO ---
  const handleDuyetPhieu = async (nhom) => {
    if (window.confirm(`Sếp có chắc chắn DUYỆT CHI ${nhom.tongThucLanh.toLocaleString("vi-VN")}đ cho tác giả ${nhom.tacGia.hoTen}?`)) {
      try {
// Thêm nguoiThaoTac vào cạnh trangThai
await Promise.all(nhom.danhSachBai.map((bai) => axios.put(`http://localhost:5000/api/nhuanbut/${bai._id}`, { trangThai: "Đã duyệt", nguoiThaoTac: tenNguoiDung })));        toast.success(`✅ Đã PHÊ DUYỆT phiếu chi cho ${nhom.tacGia.hoTen}!`);
        layDuLieu();
      } catch (error) {
        toast.error("Lỗi khi duyệt phiếu!");
      }
    }
  };

  const handleTuChoi = async (nhom) => {
    if (window.confirm(`Sếp muốn TỪ CHỐI phiếu này và trả về cho Kế toán xử lý lại?`)) {
      try {
        await Promise.all(nhom.danhSachBai.map((bai) => axios.put(`http://localhost:5000/api/nhuanbut/${bai._id}`, { trangThai: "Chờ duyệt" })));
        toast.warning(`❌ Đã TRẢ LẠI phiếu của ${nhom.tacGia.hoTen} về phòng Kế toán!`);
        layDuLieu();
      } catch (error) {
        toast.error("Lỗi khi từ chối phiếu!");
      }
    }
  };

  return (
    <div className="duyetchi-container">
      {/* --- THANH CÔNG CỤ LỌC (FILTER BAR) --- */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", backgroundColor: "#1e293b", padding: "15px", borderRadius: "10px", alignItems: "center" }}>
        <h4 style={{ margin: 0, color: "#94a3b8" }}>🔍 Bộ Lọc Nhanh:</h4>

        <select
          value={locSoBao}
          onChange={(e) => setLocSoBao(e.target.value)}
          style={{ padding: "8px 15px", borderRadius: "8px", backgroundColor: "#0f172a", color: "white", border: "1px solid rgba(255,255,255,0.1)", outline: "none" }}
        >
          {dsSoBao.map((sb) => (
            <option key={sb} value={sb}>
              {sb === "Tất cả" ? "-- Tất cả Số Báo --" : `Kỳ báo: ${sb}`}
            </option>
          ))}
        </select>

        {/* THAY THẾ BỘ LỌC TỈNH THÀNH VÀO ĐÂY */}
        <select
          value={locKhuVuc}
          onChange={(e) => setLocKhuVuc(e.target.value)}
          style={{ padding: "8px 15px", borderRadius: "8px", backgroundColor: "#0f172a", color: "white", border: "1px solid rgba(255,255,255,0.1)", outline: "none" }}
        >
          <option value="Tất cả">-- Tất cả Tỉnh / Thành phố --</option>
          {danhSachTinhThanh.map((tinh, index) => (
            <option key={index} value={tinh}>
              {tinh}
            </option>
          ))}
        </select>

        <div style={{ marginLeft: "auto", color: "#38bdf8", fontWeight: "bold" }}>Đang hiển thị: {danhSachGom.length} Phiếu Trình</div>
      </div>

      <div style={{ overflowX: "auto", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
        <table className="bang-danh-sach">
          <thead>
            <tr>
              <th>Người Thụ Hưởng (Tác Giả)</th>
              <th>Khu Vực</th>
              <th>Số Lượng Bài</th>
              <th style={{ color: "#facc15" }}>Số Tiền Đề Nghị Chi</th>
              <th>Hành Động Của Sếp</th>
            </tr>
          </thead>
          <tbody>
            {danhSachGom.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748b", fontSize: "16px" }}>
                  Hiện tại không có hồ sơ nào cần Sếp phải duyệt.
                </td>
              </tr>
            ) : (
              danhSachGom.map((nhom) => (
                <tr key={nhom.tacGia._id}>
                  <td style={{ fontWeight: "bold", fontSize: "16px", color: "#e2e8f0" }}>{nhom.tacGia.hoTen}</td>
                  <td style={{ fontStyle: "italic", color: "#94a3b8" }}>{nhom.tacGia.khuVuc || "Chưa rõ"}</td>
                  <td>
                    <span style={{ backgroundColor: "#334155", padding: "4px 8px", borderRadius: "5px", fontSize: "13px" }}>Chi tiết: {nhom.danhSachBai.length} bài</span>
                  </td>
                  <td style={{ color: "#facc15", fontWeight: "bold", fontSize: "18px" }}>{nhom.tongThucLanh.toLocaleString("vi-VN")}đ</td>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleDuyetPhieu(nhom)}
                        style={{
                          background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 15px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        ✅ DUYỆT CHI
                      </button>
                      <button
                        onClick={() => handleTuChoi(nhom)}
                        style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        ❌ TỪ CHỐI
                      </button>
                    </div>
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

export default DuyetChi;
