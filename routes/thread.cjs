const express = require("express");
require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const router = express.Router();
const {
  getThreads,
  getSingleThread,
  createThread,
  createReply,
} = require("../controllers/threadController.cjs");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.CYCLIC_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});
// GET every threads
router.get("/", getThreads);

// GET one thread
router.get("/:id", getSingleThread);

// PATCH one thread (replies)
router.patch("/:id", upload.single("image"), createReply);

// POST one thread
router.post("/", upload.single("image"), createThread);

module.exports = router;
