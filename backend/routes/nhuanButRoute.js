const express = require("express");
const router = express.Router();
const NhuanBut = require("../models/NhuanBut");
const CauHinh = require("../models/CauHinh");
// --- HÀM TÍNH THUẾ TỰ ĐỘNG (THẾ HỆ MỚI) ---
const tinhTien = async (tienGoc) => {
  // 1. Móc cấu hình từ Database lên
  let config = await CauHinh.findOne();
  if (!config) config = { mucChiuThue: 2000000, phanTramThue: 10 }; // Đề phòng lỗi

  // 2. Tính toán dựa trên cấu hình động
  const tien = Number(tienGoc) || 0;
  const thue = tien >= config.mucChiuThue ? tien * (config.phanTramThue / 100) : 0;
  const thucLanh = tien - thue;
  
  return { thue, thucLanh };
};

// 1. LẤY DANH SÁCH BÀI VIẾT HIỆN HÀNH (Đã lọc bỏ các bài bị Xóa Mềm)
router.get("/danh-sach", async (req, res) => {
  try {
    const danhSach = await NhuanBut.find({ isDeleted: { $ne: true } })
                                  .populate("tacGia", "hoTen khuVuc")
                                  .sort({ createdAt: -1 });
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 2. THÊM BÀI VIẾT MỚI (Có tính thuế)
router.post("/nhap-bai", async (req, res) => {
  try {
    const { tenBai, tacGia, soBao, tienNhuanBut, ghiChu } = req.body;
    const { thue, thucLanh } = tinhTien(tienNhuanBut);

    const baiVietMoi = new NhuanBut({
      tenBai,
      tacGia,
      soBao,
      tienNhuanBut,
      thue,
      thucLanh,
      ghiChu,
    });

    await baiVietMoi.save();
    res.status(201).json(baiVietMoi);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi thêm bài viết" });
  }
});

// 3. SỬA BÀI VIẾT VÀ LƯU VẾT KIỂM TOÁN (AUDIT LOG)
router.put("/:id", async (req, res) => {
  try {
    const { tienNhuanBut, trangThai, nguoiThaoTac } = req.body;
    let dataCapNhat = { ...req.body };

    // A. Nếu Thư ký có sửa tiền gốc -> Tính lại Thuế và Thực lãnh
    if (tienNhuanBut !== undefined) {
      const { thue, thucLanh } = await tinhTien(tienNhuanBut);
      dataCapNhat.thue = thue;
      dataCapNhat.thucLanh = thucLanh;
    }

    // B. LƯU VẾT KIỂM TOÁN: Nếu hành động là Sếp Duyệt hoặc Kế Toán Chi
    if (trangThai === "Đã duyệt" || trangThai === "Đã thanh toán") {
      if (nguoiThaoTac) {
        dataCapNhat.nguoiDuyet = nguoiThaoTac; // Bắt quả tang người bấm nút
        dataCapNhat.ngayDuyet = new Date();    // Đóng mộc thời gian hiện tại
      }
    }

    const baiVietCapNhat = await NhuanBut.findByIdAndUpdate(req.params.id, dataCapNhat, { new: true });
    res.json(baiVietCapNhat);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật bài viết" });
  }
});

// 4. XÓA MỀM BÀI VIẾT (SOFT DELETE)
router.delete("/:id", async (req, res) => {
  try {
    // Chỉ cập nhật cờ isDeleted thành true, không xóa mất xác
    await NhuanBut.findByIdAndUpdate(req.params.id, { 
      isDeleted: true,
      trangThai: "Đã hủy" 
    });
    
    res.json({ message: "Đã chuyển bài viết vào thùng rác an toàn!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

module.exports = router;