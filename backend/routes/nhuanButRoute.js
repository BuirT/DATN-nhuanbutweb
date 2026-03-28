const express = require("express");
const router = express.Router();
const NhuanBut = require("../models/NhuanBut");

// 1. API Nhập bài viết/tin/ảnh (Dành cho tổ nhập liệu)
router.post("/nhap-bai", async (req, res) => {
  try {
    const baiMoi = new NhuanBut(req.body);
    const daLuu = await baiMoi.save();
    res.status(201).json({
      message: "Nhập bài viết thành công!",
      data: daLuu,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi thêm bài viết!", error: error.message });
  }
});

// 2. API Lấy danh sách bài viết (Có kèm thông tin Tác giả)
router.get("/danh-sach", async (req, res) => {
  try {
    // Dùng .populate() để tự động lấy tên và bút danh của tác giả dựa vào ID
    const danhSach = await NhuanBut.find().populate("tacGia", "hoTen butDanh");
    res.status(200).json(danhSach);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết!", error: error.message });
  }
});

module.exports = router;
