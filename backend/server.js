const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Gọi file Route vừa tạo
const tacGiaRoute = require("./routes/tacGiaRoute");
const nhuanButRoute = require("./routes/nhuanButRoute");

const app = express();
app.use(cors());
app.use(express.json());

// Gắn Route vào đường dẫn chính
app.use("/api/tacgia", tacGiaRoute);
app.use("/api/nhuanbut", nhuanButRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Đã kết nối MongoDB Atlas thành công! ❤️"))
  .catch((err) => console.log("Lỗi kết nối rồi anh ơi: ", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});
