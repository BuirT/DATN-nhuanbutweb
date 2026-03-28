import { useState, useEffect } from "react";
import axios from "axios";
import "./ThongKe.css";

function ThongKe() {
  const [dataThongKe, setDataThongKe] = useState([]);
  const [tongToanBo, setTongToanBo] = useState(0);

  // Mặc định lấy tháng và năm hiện tại
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [nam, setNam] = useState(new Date().getFullYear());

  const layThongKe = async () => {
    try {
      // Gửi kèm tháng và năm lên Server để lọc
      const res = await axios.get(`http://localhost:5000/api/nhuanbut/thong-ke-tong?thang=${thang}&nam=${nam}`);
      setDataThongKe(res.data);
      const tong = res.data.reduce((acc, item) => acc + item.tongTien, 0);
      setTongToanBo(tong);
    } catch (error) {
      console.error("Lỗi tải thống kê", error);
    }
  };

  // Tự động tải lại dữ liệu mỗi khi anh đổi Tháng hoặc Năm
  useEffect(() => {
    layThongKe();
  }, [thang, nam]);

  return (
    <div className="thongke-container">
      <div className="card-tong">
        <h2>
          TỔNG CHI NHUẬN BÚT THÁNG {thang}/{nam}
        </h2>
        <h1 style={{ fontSize: "3rem" }}>{tongToanBo.toLocaleString()} VNĐ</h1>
      </div>

      {/* --- BỘ LỌC THỜI GIAN --- */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <label>Chọn Tháng: </label>
        <select value={thang} onChange={(e) => setThang(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <label>Năm: </label>
        <select value={nam} onChange={(e) => setNam(e.target.value)}>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      <table className="bang-thongke">
        <thead>
          <tr>
            <th>Họ và Tên</th>
            <th>Bút Danh</th>
            <th>Số bài</th>
            <th>Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          {dataThongKe.length > 0 ? (
            dataThongKe.map((item) => (
              <tr key={item._id}>
                <td>{item.infoTacGia.hoTen}</td>
                <td>{item.infoTacGia.butDanh}</td>
                <td>{item.soBai} bài</td>
                <td className="money">{item.tongTien.toLocaleString()} đ</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Tháng này chưa có bài nào được duyệt chi!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ThongKe;
