const express = require("express");
require("dotenv").config();

const {
  deleteObjects,
  listObjects,
  uploadMulter,
} = require("../utils/s3Utils.cjs");

const router = express.Router();
const {
  getThreads,
  getSingleThread,
  createThread,
  createReply,
} = require("../controllers/threadController.cjs");

listObjects();

// GET every threads
router.get("/", getThreads);

// GET one thread
router.get("/:id", getSingleThread);

// PATCH one thread (replies)
router.patch("/:id", uploadMulter.single("image"), createReply);

// POST one thread
router.post("/", uploadMulter.single("image"), createThread);

module.exports = router;
