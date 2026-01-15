const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;
