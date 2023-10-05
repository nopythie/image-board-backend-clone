const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getThreads,
  getSingleThread,
  createThread,
  createReply,
} = require("../controllers/threadController.cjs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
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
