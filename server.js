const compression = require("compression");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const threadRoutes = require("./routes/thread.cjs");
const path = require("path");
const cors = require("cors");
const corsOptions = {
  origin: "https://cemus.github.io",
  credentials: true,
  optionSuccessStatus: 200,
};

const port = process.env.PORT || 3000;
const app = express();
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(express.static(path.join(__dirname, "images")));
app.use("/api/threads", threadRoutes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur lancé.`);
      console.log(process.env.S3_BUCKET_NAME);
    });
  })
  .catch((err) => {
    console.log(err);
  });
