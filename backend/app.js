const express = require("express");
const mongoose = require("mongoose");
const postSchema = require("./models/post.model");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
app.use(fileUpload({}));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser({}));
app.use(express.static("static"));

// Routes
app.use("/api/post", require("./routes/post.route"));
app.use("/api/auth", require("./routes/auth.route"));

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startApp = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected with DB");
    app.listen(PORT || 5000, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error connecting with DB:", error);
  }
};

startApp();
