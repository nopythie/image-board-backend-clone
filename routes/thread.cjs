const express = require("express");
require("dotenv").config();
const multer = require("multer");
const { deleteObjects, listObjects } = require("../utils/s3Utils.cjs");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const s3 = new S3Client();
const router = express.Router();
const {
  getThreads,
  getSingleThread,
  createThread,
  createReply,
} = require("../controllers/threadController.cjs");
const bucketName = process.env.CYCLIC_BUCKET_NAME;
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

listObjects(s3, bucketName);

// GET every threads
router.get("/", getThreads);

// GET one thread
router.get("/:id", getSingleThread);

// PATCH one thread (replies)
router.patch("/:id", upload.single("image"), createReply);

// POST one thread
router.post("/", upload.single("image"), createThread);

module.exports = router;
