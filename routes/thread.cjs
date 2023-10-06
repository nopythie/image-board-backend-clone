const express = require("express");
require("dotenv").config();
const multer = require("multer");
const router = express.Router();
const {
  getThreads,
  getSingleThread,
  createThread,
  createReply,
} = require("../controllers/threadController.cjs");
console.log("pas ok");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
console.log("ok");
const upload = multer({ storage: storage });

// GET every threads
router.get("/", getThreads);

// GET one thread
router.get("/:id", getSingleThread);

// PATCH one thread (replies)
router.patch("/:id", upload.single("image"), createReply);

// POST one thread
router.post("/", upload.single("image"), createThread);

module.exports = router;
