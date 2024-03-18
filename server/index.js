const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { connectDB } = require("./utils/connectDB");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");

const app = express();

connectDB(process.env.MONGO_URL);

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/files", express.static("./public/files"))

app.use((req, res, next) => {
  return res.status(404).json({ error: "Page Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server Is Listening On ${process.env.PORT}`);
});
