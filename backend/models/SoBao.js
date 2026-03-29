const mongoose = require("mongoose");

const soBaoSchema = new mongoose.Schema(
  {
    maSoBao: {
      type: String,
      required: true,
      unique: true, // Đảm bảo không bị trùng mã số báo
    },
    tenBao: {
      type: String,
      required: true,
    },
    ngayRa: {
      type: Date,
      required: true,
    },
    loaiBao: {
      type: String,
      default: "Báo In",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SoBao", soBaoSchema);
