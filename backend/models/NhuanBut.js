const mongoose = require("mongoose");

const nhuanButSchema = new mongoose.Schema(
  {
    tenBai: { type: String, required: true },

    // Liên kết với bảng Tác Giả
    tacGia: { type: mongoose.Schema.Types.ObjectId, ref: "TacGia", required: true },

    // Lấy mã số báo từ Menu xổ xuống
    soBao: { type: String, required: true },

    // TIỀN BẠC (Gốc - Thuế - Thực lãnh)
    tienNhuanBut: { type: Number, required: true },
    thue: { type: Number, default: 0 },
    thucLanh: { type: Number, default: 0 },

    ghiChu: { type: String },
    trangThai: { type: String, default: "Chờ duyệt" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("NhuanBut", nhuanButSchema);
