import { useState, useEffect } from "react";
import axios from "axios";
import "./ThongKe.css";

function ThongKe() {
  const [dataThongKe, setDataThongKe] = useState([]);
  const [tongToanBo, setTongToanBo] = useState(0);

  useEffect(() => {
    const layThongKe = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/nhuanbut/thong-ke-tong");
        setDataThongKe(res.data);
        // Tính tổng cộng dồn tất cả tác giả
        const tong = res.data.reduce((acc, item) => acc + item.tongTien, 0);
        setTongToanBo(tong);
      } catch (error) {
        console.error("Lỗi tải thống kê", error);
      }
    };
    layThongKe();
  }, []);

  return (
    <div className="thongke-container">
      <div className="card-tong">
        <h2>TỔNG CHI TRẢ NHUẬN BÚT</h2>
        <h1 style={{ fontSize: "3rem" }}>{tongToanBo.toLocaleString()} VNĐ</h1>
        <p>Dựa trên các bài viết đã được Lãnh đạo phê duyệt</p>
      </div>

      <h3>Chi tiết theo từng Tác giả</h3>
      <table className="bang-thongke">
        <thead>
          <tr>
            <th>Họ và Tên</th>
            <th>Bút Danh</th>
            <th>Số lượng bài</th>
            <th>Tổng Nhuận Bút</th>
          </tr>
        </thead>
        <tbody>
          {dataThongKe.map((item) => (
            <tr key={item._id}>
              <td>
                <strong>{item.infoTacGia.hoTen}</strong>
              </td>
              <td>{item.infoTacGia.butDanh}</td>
              <td>{item.soBai} bài</td>
              <td className="money">{item.tongTien.toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ThongKe;
