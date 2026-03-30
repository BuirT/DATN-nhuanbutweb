const express = require("express");
const router = express.Router();
const CauHinh = require("../models/CauHinh");

// 1. LẤY CẤU HÌNH HIỆN TẠI (Nếu chưa có thì tự động tạo mức mặc định)
router.get("/", async (req, res) => {
  try {
    let config = await CauHinh.findOne();
    if (!config) {
      config = new CauHinh();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// 2. CẬP NHẬT CẤU HÌNH (Sau này Admin xài)
router.put("/", async (req, res) => {
  try {
    const { mucChiuThue, phanTramThue } = req.body;
    let config = await CauHinh.findOne();
    
    if (!config) {
      config = new CauHinh({ mucChiuThue, phanTramThue });
    } else {
      config.mucChiuThue = mucChiuThue;
      config.phanTramThue = phanTramThue;
    }
    
    await config.save();
    res.json({ message: "Đã cập nhật luật Thuế mới!", config });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

module.exports = router;