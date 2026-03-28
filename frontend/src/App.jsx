import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TacGia from "./components/TacGia/TacGia";
import NhuanBut from "./components/NhuanBut/NhuanBut";
import DuyetChi from "./components/DuyetChi/DuyetChi";
import ThongKe from "./components/ThongKe/ThongKe";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* --- THANH MENU ĐIỀU HƯỚNG --- */}
        <nav className="navbar">
          <h1 className="logo">TÒA SOẠN BÁO</h1>
          <ul className="nav-links">
            {/* Trang chủ giờ sẽ dẫn thẳng đến Thống kê */}
            <li>
              <Link to="/">Báo Cáo Thống Kê</Link>
            </li>
            <li>
              <Link to="/tac-gia">Quản lý Tác Giả</Link>
            </li>
            <li>
              <Link to="/nhuan-but">Quản lý Nhuận Bút</Link>
            </li>
            <li>
              <Link to="/duyet-chi">Lãnh Đạo Duyệt</Link>
            </li>
          </ul>
        </nav>

        {/* --- KHU VỰC HIỂN THỊ NỘI DUNG TƯƠNG ỨNG VỚI MENU --- */}
        <div className="main-content">
          <Routes>
            {/* Đường dẫn "/" bây giờ sẽ hiện trang Thống Kê đầu tiên */}
            <Route path="/" element={<ThongKe />} />

            {/* Các trang còn lại được đặt ở các đường dẫn riêng biệt */}
            <Route path="/tac-gia" element={<TacGia />} />
            <Route path="/nhuan-but" element={<NhuanBut />} />
            <Route path="/duyet-chi" element={<DuyetChi />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
