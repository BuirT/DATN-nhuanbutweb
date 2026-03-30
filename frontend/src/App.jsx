import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import TacGia from "./components/TacGia/TacGia";
import NhuanBut from "./components/NhuanBut/NhuanBut";
import DuyetChi from "./components/DuyetChi/DuyetChi";
import ThongKe from "./components/ThongKe/ThongKe";
import Login from "./components/Login/Login";
import SoBao from "./components/SoBao/SoBao";
import PhieuChi from "./components/PhieuChi/PhieuChi";
import TaiKhoan from "./components/TaiKhoan/TaiKhoan";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [vaiTro, setVaiTro] = useState(localStorage.getItem("vaiTro") || "");
  const [hoTen, setHoTen] = useState(localStorage.getItem("hoTen") || "");

  const handleLoginSuccess = () => {
    setVaiTro(localStorage.getItem("vaiTro") || "");
    setHoTen(localStorage.getItem("hoTen") || "");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hoTen");
    localStorage.removeItem("vaiTro");
    setVaiTro("");
    setHoTen("");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  // --- HÀM KIỂM TRA QUYỀN TRUY CẬP ---
  const isThuKy = vaiTro === "Nhập Liệu" || vaiTro === "Thư ký" || vaiTro === "Admin";
  const isKeToan = vaiTro === "Kế Toán" || vaiTro === "Kế toán" || vaiTro === "Admin";
  const isLanhDao = vaiTro === "Lãnh đạo" || vaiTro === "Lãnh Đạo" || vaiTro === "Admin";
  const isAdmin = vaiTro === "Admin";

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div>
        <nav className="navbar">
          <h1 className="logo">TÒA SOẠN BÁO</h1>

          {/* Xóa toàn bộ style inline, nhường sân chơi cho CSS */}
          <ul className="nav-links">
            <li>
              <Link to="/">Báo Cáo Thống Kê</Link>
            </li>

            {isThuKy && (
              <>
                <li>
                  <Link to="/tac-gia">Quản lý Tác Giả</Link>
                </li>
                <li>
                  <Link to="/so-bao">Quản lý Số Báo</Link>
                </li>
                <li>
                  <Link to="/nhuan-but">Quản lý Nhuận Bút</Link>
                </li>
              </>
            )}

            {isKeToan && (
              <li>
                <Link to="/phieu-chi">Kế Toán Xuất Phiếu</Link>
              </li>
            )}

            {isLanhDao && (
              <li>
                <Link to="/duyet-chi">Lãnh Đạo Duyệt</Link>
              </li>
            )}

            {isAdmin && (
              <li>
                <Link to="/quan-ly-tai-khoan">Quản Lý Tài Khoản</Link>
              </li>
            )}

            {/* Gắn class riêng cho khu vực người dùng để CSS dễ bắt */}
            <li className="user-info-item">
              <span className="user-greeting">
                👤 {vaiTro}: <strong>{hoTen}</strong>
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Đăng Xuất
              </button>
            </li>
          </ul>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<ThongKe />} />

            {isThuKy && (
              <>
                <Route path="/tac-gia" element={<TacGia />} />
                <Route path="/so-bao" element={<SoBao />} />
                <Route path="/nhuan-but" element={<NhuanBut />} />
              </>
            )}

            {isKeToan && <Route path="/phieu-chi" element={<PhieuChi />} />}
            {isLanhDao && <Route path="/duyet-chi" element={<DuyetChi />} />}
            {isAdmin && <Route path="/quan-ly-tai-khoan" element={<TaiKhoan />} />}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
