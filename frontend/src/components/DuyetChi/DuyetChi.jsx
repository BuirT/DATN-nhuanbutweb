import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./DuyetChi.css"; // ĐÃ GỌI FILE CSS MỚI

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

  // --- BỘ LỌC VÀ TRẠNG THÁI ---
  const [locKhuVuc, setLocKhuVuc] = useState("Tất cả");
  const [locSoBao, setLocSoBao] = useState("Tất cả");

  // QUẢN LÝ DÒNG MỞ RỘNG (ACCORDION)
  const [expandedRows, setExpandedRows] = useState([]);

  // Lấy tên Lãnh đạo đăng nhập để đóng mộc
  const tenNguoiDung = localStorage.getItem("hoTen") || "Lãnh Đạo Vô Danh";

  const layDuLieu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/nhuanbut/danh-sach");
      const baiTrinhDuyet = res.data.filter((bai) => bai.trangThai === "Trình Lãnh Đạo");
      setDanhSachBaiViet(baiTrinhDuyet);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu trình duyệt!");
    }
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  const dsSoBao = ["Tất cả", ...new Set(danhSachBaiViet.map((b) => b.soBao).filter(Boolean))];

  // --- LỌC DỮ LIỆU ---
  const danhSachSauLoc = danhSachBaiViet.filter((bai) => {
    const matchKhuVuc = locKhuVuc === "Tất cả" || bai.tacGia?.khuVuc === locKhuVuc;
    const matchSoBao = locSoBao === "Tất cả" || bai.soBao === locSoBao;
    return matchKhuVuc && matchSoBao;
  });

  // --- Gom bài theo tác giả; tổng thuế / thực lãnh lấy từ dữ liệu từng bài (khớp backend) ---
  const groupedData = danhSachSauLoc.reduce((acc, bai) => {
    const idTG = bai.tacGia?._id;
    if (!idTG) return acc;

    if (!acc[idTG]) {
      acc[idTG] = { tacGia: bai.tacGia, danhSachBai: [], tongGoc: 0 };
    }
    acc[idTG].danhSachBai.push(bai);
    acc[idTG].tongGoc += Number(bai.tienNhuanBut) || 0;

    return acc;
  }, {});

  const danhSachGom = Object.values(groupedData).map((nhom) => {
    const tongThue = nhom.danhSachBai.reduce((s, b) => s + (Number(b.thue) || 0), 0);
    const tongThucLanh = nhom.danhSachBai.reduce((s, b) => s + (Number(b.thucLanh) || 0), 0);
    return {
      ...nhom,
      tongThue,
      tongThucLanh,
    };
  });

  // HÀM ĐÓNG MỞ BẢNG CHI TIẾT
  const toggleRow = (idTG) => {
    setExpandedRows((prev) => (prev.includes(idTG) ? prev.filter((id) => id !== idTG) : [...prev, idTG]));
  };

  // --- HÀNH ĐỘNG CỦA LÃNH ĐẠO ---
  const handleDuyetPhieu = async (nhom) => {
    if (window.confirm(`Sếp có chắc chắn DUYỆT CHI ${nhom.tongThucLanh.toLocaleString("vi-VN")}đ cho tác giả ${nhom.tacGia.hoTen}?`)) {
      try {
        await Promise.all(nhom.danhSachBai.map((bai) => axios.put(`http://localhost:5000/api/nhuanbut/${bai._id}`, { trangThai: "Đã duyệt", nguoiThaoTac: tenNguoiDung })));
        toast.success(`Đã PHÊ DUYỆT phiếu chi cho ${nhom.tacGia.hoTen}!`);
        layDuLieu();
      } catch (error) {
        toast.error("Lỗi khi duyệt phiếu!");
      }
    }
  };

  const handleTuChoi = async (nhom) => {
    if (window.confirm(`Sếp muốn TỪ CHỐI phiếu này và trả về cho Kế toán xử lý lại?`)) {
      try {
        await Promise.all(
          // Trả về Chờ duyệt và cũng lưu lại tên người từ chối
          nhom.danhSachBai.map((bai) => axios.put(`http://localhost:5000/api/nhuanbut/${bai._id}`, { trangThai: "Chờ duyệt", nguoiThaoTac: tenNguoiDung })),
        );
        toast.warning(`Đã TRẢ LẠI phiếu của ${nhom.tacGia.hoTen} về phòng Kế toán!`);
        layDuLieu();
      } catch (error) {
        toast.error("Lỗi khi từ chối phiếu!");
      }
    }
  };

  return (
    <div className="duyetchi-container">
      {/* THANH CÔNG CỤ LỌC */}
      <div className="filter-bar">
        <h4 className="filter-title">Bộ Lọc Nhanh:</h4>
        <select value={locSoBao} onChange={(e) => setLocSoBao(e.target.value)} className="filter-select">
          {dsSoBao.map((sb) => (
            <option key={sb} value={sb}>
              {sb === "Tất cả" ? "-- Tất cả Số Báo --" : `Kỳ báo: ${sb}`}
            </option>
          ))}
        </select>
        <select value={locKhuVuc} onChange={(e) => setLocKhuVuc(e.target.value)} className="filter-select">
          <option value="Tất cả">-- Tất cả Tỉnh / Thành phố --</option>
          {danhSachTinhThanh.map((tinh, index) => (
            <option key={index} value={tinh}>
              {tinh}
            </option>
          ))}
        </select>
        <div className="filter-count">Đang hiển thị: {danhSachGom.length} Phiếu Trình</div>
      </div>

      <div className="table-wrapper">
        <table className="bang-danh-sach">
          <thead>
            <tr>
              <th>Người Thụ Hưởng</th>
              <th>Khu Vực</th>
              <th>Số Lượng Bài</th>
              <th className="text-red">Thuế TNCN</th>
              <th style={{ color: "#facc15" }}>Số Tiền Đề Nghị Chi</th>
              <th>Hành Động Của Sếp</th>
            </tr>
          </thead>
          <tbody>
            {danhSachGom.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#64748b", fontSize: "16px" }}>
                  Hiện tại không có hồ sơ nào cần Sếp phải duyệt.
                </td>
              </tr>
            ) : (
              danhSachGom.map((nhom) => (
                <span key={nhom.tacGia._id} style={{ display: "contents" }}>
                  {/* DÒNG CHÍNH MÀN HÌNH LÃNH ĐẠO */}
                  <tr className={expandedRows.includes(nhom.tacGia._id) ? "row-expanded" : ""}>
                    <td className="text-bold">{nhom.tacGia.hoTen}</td>
                    <td className="text-italic">{nhom.tacGia.khuVuc || "Chưa rõ"}</td>
                    <td>
                      <button onClick={() => toggleRow(nhom.tacGia._id)} className="btn-toggle">
                        {expandedRows.includes(nhom.tacGia._id) ? "Đóng" : " Xem chi tiết"} ({nhom.danhSachBai.length} bài)
                      </button>
                    </td>
                    {/* Bổ sung cột Thuế để Sếp dễ đối chiếu */}
                    <td className="text-red">{nhom.tongThue > 0 ? `-${nhom.tongThue.toLocaleString("vi-VN")}đ` : "0đ"}</td>
                    <td className="text-highlight">{nhom.tongThucLanh.toLocaleString("vi-VN")}đ</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleDuyetPhieu(nhom)} className="btn-approve">
                          DUYỆT CHI
                        </button>
                        <button onClick={() => handleTuChoi(nhom)} className="btn-reject">
                          TỪ CHỐI
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* BẢNG CON CHI TIẾT KHI XỔ RA */}
                  {expandedRows.includes(nhom.tacGia._id) && (
                    <tr className="sub-table-row">
                      <td colSpan="6" className="sub-table-cell">
                        <div className="sub-table-content">
                          <h4 className="sub-table-title">Chi tiết các bài báo trình duyệt:</h4>
                          <table className="sub-table">
                            <tbody>
                              {nhom.danhSachBai.map((bai, idx) => (
                                <tr key={bai._id}>
                                  <td className="col-index">{idx + 1}.</td>
                                  <td className="col-name">{bai.tenBaiViet || bai.tenBai || bai.tieuDe || "Chưa cập nhật tên bài"}</td>
                                  <td className="col-issue">Kỳ: {bai.soBao || "N/A"}</td>
                                  <td className="col-money">{Number(bai.tienNhuanBut).toLocaleString("vi-VN")}đ</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </span>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DuyetChi;
