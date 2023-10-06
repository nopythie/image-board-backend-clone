const express = require("express");
require("dotenv").config();
const multer = require("multer");
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

const listObjects = async (bucketName) => {
  const params = {
    Bucket: process.env.CYCLIC_BUCKET_NAME,
  };
  const command = new ListObjectsCommand(params);
  try {
    const data = await s3.send(command);
    console.log("Objets dans le bucket:");
    data.Contents.forEach((object) => {
      console.log(object.Key);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Utilisation
listObjects("nom-de-votre-bucket");

// GET every threads
router.get("/", getThreads);

// GET one thread
router.get("/:id", getSingleThread);

// PATCH one thread (replies)
router.patch("/:id", upload.single("image"), createReply);

// POST one thread
router.post("/", upload.single("image"), createThread);

module.exports = router;
