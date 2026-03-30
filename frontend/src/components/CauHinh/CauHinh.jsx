import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CauHinh.css"; // BẮT BUỘC PHẢI IMPORT FILE CSS VÀO ĐÂY NÈ

function CauHinh() {
  const [formData, setFormData] = useState({
    mucChiuThue: 2000000,
    phanTramThue: 10,
  });

  // Lấy cấu hình hiện tại từ Backend
  const layCauHinh = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cauhinh");
      if (res.data) {
        setFormData({
          mucChiuThue: res.data.mucChiuThue,
          phanTramThue: res.data.phanTramThue,
        });
      }
    } catch (error) {
      toast.error("Lỗi tải cấu hình hệ thống từ Server!");
    }
  };

  useEffect(() => {
    layCauHinh();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm(`Sếp có chắc chắn muốn đổi luật Thuế mới không?\n- Mức chịu thuế: ${formData.mucChiuThue.toLocaleString()}đ\n- Tỷ lệ thu: ${formData.phanTramThue}%`)) {
      try {
        await axios.put("http://localhost:5000/api/cauhinh", formData);
        toast.success("Cập nhật Luật Thuế thành công! Hệ thống sẽ tính theo mức mới. ⚖️");
      } catch (error) {
        toast.error("Lỗi khi lưu cấu hình!");
      }
    }
  };

  return (
    <div className="cauhinh-container">
      
      {/* Header Hướng dẫn */}
      <div className="cauhinh-header">
        <h2 className="cauhinh-title">
          ⚙️ BẢNG ĐIỀU KHIỂN: CẤU HÌNH HỆ THỐNG
        </h2>
        <p className="cauhinh-desc">
          * Khu vực đặc quyền của Admin. Mọi thay đổi tại đây sẽ ngay lập tức áp dụng cho quá trình tính toán Nhuận bút của toàn bộ Tòa soạn.
        </p>
      </div>

      {/* Form Nhập liệu */}
      <div className="cauhinh-card">
        <h3 className="cauhinh-card-title">Luật Thuế Thu Nhập Cá Nhân (TNCN)</h3>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Mức thu nhập bắt đầu chịu thuế (VNĐ):</label>
            <input 
              type="number" 
              name="mucChiuThue" 
              value={formData.mucChiuThue} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
            <small className="form-hint">
              Hiện tại: Từ <strong>{formData.mucChiuThue.toLocaleString()}đ</strong> trở lên sẽ bị trừ thuế.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Phần trăm thu Thuế (%):</label>
            <input 
              type="number" 
              name="phanTramThue" 
              value={formData.phanTramThue} 
              onChange={handleChange} 
              className="form-input"
              required 
              min="0"
              max="100"
            />
          </div>

          <button type="submit" className="btn-submit-cauhinh">
            💾 LƯU CẤU HÌNH MỚI
          </button>

        </form>
      </div>
    </div>
  );
}

export default CauHinh;