const mongoose = require("mongoose");

const tacGiaSchema = new mongoose.Schema(
  {
    maTacGia: { type: String, required: true, unique: true }, // Tương đương MsTG
    hoTen: { type: String, required: true },
    butDanh: { type: String },
    loaiTacGia: { type: String, enum: ["Phóng viên", "CTV"], default: "CTV" }, // Phân loại theo quy trình
    khuVuc: { type: String, default: "TP.HCM" }, // Để phân vùng chi trả CTV
    dienThoai: { type: String },
    email: { type: String },
    cmnd_cccd: { type: String },
    maSoThue: { type: String },
  },
  { timestamps: true },
); // Tự động lưu ngày tạo và cập nhật

module.exports = mongoose.model("TacGia", tacGiaSchema);
