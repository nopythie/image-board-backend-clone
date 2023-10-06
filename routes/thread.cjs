const express = require("express");
require("dotenv").config();
const multer = require("multer");
const { deleteObjects } = require("../utils/emptyS3Bucket.cjs");
const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const s3 = new S3Client();
const router = express.Router();
const {
  getThreads,
  getSingleThread,
  createThread,
  createReply,
} = require("../controllers/threadController.cjs");
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.CYCLIC_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

deleteObjects(s3, process.env.CYCLIC_BUCKET_NAME);

// GET every threads
router.get("/", getThreads);

// GET one thread
router.get("/:id", getSingleThread);

// PATCH one thread (replies)
router.patch("/:id", upload.single("image"), createReply);

// POST one thread
router.post("/", upload.single("image"), createThread);

module.exports = router;
