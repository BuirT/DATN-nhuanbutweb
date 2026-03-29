import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import "./DuyetChi.css";

function DuyetChi() {
  const [danhSachBaiViet, setDanhSachBaiViet] = useState([]);

  // Lấy danh sách bài viết từ Backend
  const layDuLieu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/nhuanbut/danh-sach");
      setDanhSachBaiViet(res.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    layDuLieu();
  }, []);

  // Hàm xử lý khi Lãnh đạo bấm nút "Duyệt"
  const handleDuyetBai = async (id) => {
    const xacNhan = window.confirm("Xác nhận duyệt chi trả cho bài viết này?");
    if (!xacNhan) return;

    try {
      await axios.put(`http://localhost:5000/api/duyetchi/duyet-bai/${id}`, {
        trangThai: "Đã duyệt",
      });
      toast.success("Đã duyệt chi thành công! Tiền đã xuất kho 💸");
      layDuLieu(); // Cập nhật lại bảng ngay lập tức
    } catch (error) {
      console.error("Lỗi khi duyệt:", error);
      toast.error("Có lỗi xảy ra, không thể duyệt bài!");
    }
  };

  return (
    <div className="duyetchi-container">
      <h2>Ban Lãnh Đạo Ký Duyệt</h2>
      <table className="bang-duyet">
        <thead>
          <tr>
            <th>Tên Bài</th>
            <th>Tác Giả</th>
            <th>Số Báo</th>
            <th>Tiền Gốc</th>
            <th style={{ color: "#f87171" }}>Thuế TNCN</th>
            <th style={{ color: "#34d399" }}>Thực Lãnh</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {danhSachBaiViet.map((bai) => {
            // Đề phòng các bài viết cũ anh nhập trước đó chưa có cột thuế trong Database
            const tienGoc = bai.tienNhuanBut || 0;
            const tienThue = bai.thue || 0;
            const thucLanh = bai.thucLanh || tienGoc; // Không có thuế thì thực lãnh = tiền gốc

            return (
              <tr key={bai._id}>
                <td>
                  <strong>{bai.tenBai}</strong>
                </td>
                <td>{bai.tacGia?.hoTen}</td>
                <td style={{ fontWeight: "bold", color: "#4facfe" }}>{bai.soBao}</td>

                {/* --- KHU VỰC HIỂN THỊ TIỀN BẠC RÕ RÀNG --- */}
                <td style={{ fontWeight: "bold" }}>{tienGoc.toLocaleString("vi-VN")}đ</td>
                <td style={{ color: "#f87171" }}>{tienThue > 0 ? `-${tienThue.toLocaleString("vi-VN")}đ` : "0đ"}</td>
                <td style={{ color: "#34d399", fontWeight: "bold", fontSize: "16px" }}>{thucLanh.toLocaleString("vi-VN")}đ</td>

                <td>
                  <span className={bai.trangThai === "Chờ duyệt" ? "badge-cho" : "badge-xong"}>{bai.trangThai}</span>
                </td>
                <td>
                  {bai.trangThai === "Chờ duyệt" ? (
                    <button className="btn-duyet" onClick={() => handleDuyetBai(bai._id)}>
                      ✔️ Duyệt Chi
                    </button>
                  ) : (
                    <button className="btn-da-duyet" disabled>
                      Đã Duyệt
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DuyetChi;
