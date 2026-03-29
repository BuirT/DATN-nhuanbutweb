const mongoose = require("mongoose");

const phieuChiSchema = new mongoose.Schema(
  {
    // Mã phiếu tự động sinh (VD: PC-170123456)
    soPhieu: { type: String, required: true, unique: true },

    // Liên kết với Tác giả
    tacGia: { type: mongoose.Schema.Types.ObjectId, ref: "TacGia", required: true },

    // Lưu lại danh sách các ID bài viết được thanh toán trong phiếu này
    danhSachBai: [{ type: mongoose.Schema.Types.ObjectId, ref: "NhuanBut" }],

    // Tiền bạc
    tongTien: { type: Number, required: true },
    tongThue: { type: Number, default: 0 },
    thucLanh: { type: Number, required: true },

    hinhThuc: { type: String, required: true }, // Chuyển khoản hoặc Tiền mặt
    lyDo: { type: String },

    ngayLap: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PhieuChi", phieuChiSchema);
