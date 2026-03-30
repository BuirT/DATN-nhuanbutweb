const mongoose = require("mongoose");

const nhuanButSchema = new mongoose.Schema({
  tenBai: { type: String, required: true },
  tacGia: { type: mongoose.Schema.Types.ObjectId, ref: "TacGia", required: true },
  soBao: { type: String, required: true },
  tienNhuanBut: { type: Number, required: true },
  thue: { type: Number, default: 0 },
  thucLanh: { type: Number, default: 0 },
  ghiChu: { type: String, default: "" },
  trangThai: { type: String, default: "Chờ duyệt" },
  // 👉 THÊM 2 DÒNG NÀY ĐỂ LƯU VẾT KIỂM TOÁN:
  nguoiDuyet: { type: String, default: "" }, // Lưu tên người bấm Duyệt/Chi
  ngayDuyet: { type: Date, default: null },  // Lưu thời gian bấm nút
  // 👉 ĐÂY LÀ TÍNH NĂNG XÓA MỀM (Soft Delete)
  isDeleted: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model("NhuanBut", nhuanButSchema);