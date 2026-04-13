const mongoose = require("mongoose");

const soBaoSchema = new mongoose.Schema(
  {
    maSoBao: {
      type: String,
      required: true,
      unique: true, // Đảm bảo không bị trùng mã số báo
    },
    tenSoBao: {
      type: String,
      required: true,
    },
    ngayPhatHanh: {
      type: Date,
      required: true,
    },
    loaiBao: {
      type: String,
      default: "Báo In",
    },
    nganSach: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SoBao", soBaoSchema);
