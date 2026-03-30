const express = require("express");
const router = express.Router();
const SoBao = require("../models/SoBao"); // Đảm bảo đường dẫn này trỏ đúng tới file model Số Báo của dự án

// --- 1. LẤY DANH SÁCH SỐ BÁO ---
router.get("/danh-sach", async (req, res) => {
  try {
    const danhSach = await SoBao.find().sort({ createdAt: -1 });
    res.json(danhSach);
  } catch (error) {
    console.error("Lỗi lấy danh sách số báo:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
});

// THÊM SỐ BÁO MỚI
router.post("/them", async (req, res) => {
  try {
    // 1. Nhận đúng tên hàng từ Frontend gửi xuống
    const { maSoBao, tenSoBao, ngayPhatHanh, loaiBao } = req.body;

    // 2. Bỏ vào khuôn mới
    const soBaoMoi = new SoBao({
      maSoBao,
      tenSoBao,
      ngayPhatHanh,
      loaiBao,
    });

    // 3. Lưu vào Két sắt
    await soBaoMoi.save();
    res.status(201).json(soBaoMoi);
  } catch (error) {
    // Nếu bị trùng Mã Số Báo thì báo lỗi đẹp
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mã Số Báo này đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi Server khi thêm Số Báo" });
  }
});

// --- 3. CẬP NHẬT SỐ BÁO (Dùng cho Sửa) ---
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tenSoBao, ngayPhatHanh, loaiBao, nganSach } = req.body;

    const soBaoCapNhat = await SoBao.findByIdAndUpdate(
      id,
      { tenSoBao, ngayPhatHanh, loaiBao, nganSach: Number(nganSach) || 0 },
      { new: true }, // Yêu cầu trả về dữ liệu mới sau khi đã sửa xong
    );

    if (!soBaoCapNhat) {
      return res.status(404).json({ message: "Không tìm thấy số báo!" });
    }

    res.json({ message: "Cập nhật thành công", data: soBaoCapNhat });
  } catch (error) {
    console.error("Lỗi cập nhật số báo:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
});

// --- 4. XÓA SỐ BÁO ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const soBaoXoa = await SoBao.findByIdAndDelete(id);

    if (!soBaoXoa) {
      return res.status(404).json({ message: "Không tìm thấy số báo để xóa!" });
    }

    res.json({ message: "Đã xóa số báo thành công" });
  } catch (error) {
    console.error("Lỗi xóa số báo:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
});

module.exports = router;
