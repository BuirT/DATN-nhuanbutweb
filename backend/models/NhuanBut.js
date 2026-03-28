const mongoose = require("mongoose");

const nhuanButSchema = new mongoose.Schema(
  {
    tenBai: { type: String, required: true },
    tacGia: { type: mongoose.Schema.Types.ObjectId, ref: "TacGia", required: true }, // Liên kết với bảng TacGia
    muc: { type: String }, // Mục tin/bài/ảnh
    tienNhuanBut: { type: Number, required: true },
    soBao: { type: String }, // Số báo phát hành
    trangThai: {
      type: String,
      enum: ["Chờ duyệt", "Đã duyệt", "Đã chi trả"],
      default: "Chờ duyệt",
    },
    nguoiNhap: { type: String }, // Người nhập liệu hệ thống
    ghiChu: { type: String }, // Xử lý sai sót như chấm sót, cao tiền...
  },
  { timestamps: true },
);

module.exports = mongoose.model("NhuanBut", nhuanButSchema);
