const express = require("express");
const router = express.Router();
const SoBao = require("../models/SoBao");

// 1. LẤY DANH SÁCH SỐ BÁO
router.get("/danh-sach", async (req, res) => {
  try {
    const danhSach = await SoBao.find().sort({ ngayRa: -1 }); // Xếp báo mới nhất lên đầu
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu số báo" });
  }
});

// 2. THÊM SỐ BÁO MỚI
router.post("/them", async (req, res) => {
  try {
    const { maSoBao, tenBao, ngayRa, loaiBao } = req.body;

    // Kiểm tra trùng mã
    const baoTonTai = await SoBao.findOne({ maSoBao });
    if (baoTonTai) return res.status(400).json({ message: "Mã số báo đã tồn tại!" });

    const soBaoMoi = new SoBao({ maSoBao, tenBao, ngayRa, loaiBao });
    await soBaoMoi.save();
    res.status(201).json(soBaoMoi);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi thêm số báo" });
  }
});

// 3. CẬP NHẬT SỐ BÁO
router.put("/:id", async (req, res) => {
  try {
    const soBaoCapNhat = await SoBao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(soBaoCapNhat);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật số báo" });
  }
});

// 4. XÓA SỐ BÁO
router.delete("/:id", async (req, res) => {
  try {
    await SoBao.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa số báo thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa số báo" });
  }
});

module.exports = router;
