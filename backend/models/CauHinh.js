const mongoose = require("mongoose");

const cauHinhSchema = new mongoose.Schema({
  mucChiuThue: { type: Number, default: 2000000 }, // Mặc định 2 triệu
  phanTramThue: { type: Number, default: 10 }      // Mặc định 10%
}, { timestamps: true });

module.exports = mongoose.model("CauHinh", cauHinhSchema);