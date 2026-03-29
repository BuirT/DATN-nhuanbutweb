const express = require("express");
const router = express.Router();
const PhieuChi = require("../models/PhieuChi");
const NhuanBut = require("../models/NhuanBut");

// 1. TẠO PHIẾU CHI VÀ TẤT TOÁN BÀI VIẾT
router.post("/tao-phieu", async (req, res) => {
  try {
    const { tacGia, danhSachBai, tongTien, tongThue, thucLanh, hinhThuc, lyDo } = req.body;

    // Sinh mã phiếu chi tự động dựa trên thời gian (VD: PC-1711612000)
    const soPhieu = "PC-" + Date.now();

    // Bước A: Lưu chứng từ Phiếu Chi vào kho
    const phieuMoi = new PhieuChi({
      soPhieu,
      tacGia,
      danhSachBai,
      tongTien,
      tongThue,
      thucLanh,
      hinhThuc,
      lyDo,
    });
    await phieuMoi.save();

    // Bước B: Đổi trạng thái hàng loạt bài viết từ "Đã duyệt" -> "Đã thanh toán"
    // Dùng $in để tìm tất cả các bài có ID nằm trong danhSachBai
    await NhuanBut.updateMany({ _id: { $in: danhSachBai } }, { $set: { trangThai: "Đã thanh toán" } });

    res.status(201).json({
      message: "Đã xuất phiếu và tất toán thành công",
      phieuChi: phieuMoi,
    });
  } catch (error) {
    console.error("Lỗi khi lập phiếu:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi lập phiếu chi" });
  }
});

// 2. LẤY LỊCH SỬ PHIẾU CHI (Dùng cho Báo cáo sau này)
router.get("/danh-sach", async (req, res) => {
  try {
    const danhSach = await PhieuChi.find().populate("tacGia", "hoTen maTacGia").sort({ ngayLap: -1 });
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách phiếu chi" });
  }
});

module.exports = router;
