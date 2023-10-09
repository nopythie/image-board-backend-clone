import validateImageType from "../utils/validateImageType.js";
import getImageMetadata from "../utils/getImageMetadata.js";
import { uniqueIdGeneration } from "../utils/uniqueIdGeneration.js";
import { Types } from "mongoose";
import { Thread, Reply } from "../models/threadModel.js";
require("dotenv").config();
import cyclic from "@cyclic.sh/s3fs";
const { readFile } = cyclic;
import { downloadImageFromS3 } from "../utils/s3Utils.js";

// GET every threads
const getThreads = async (req, res) => {
  const threads = await Thread.find({}).sort({ bumpDate: -1 });
  if (!threads) {
    return res.status(204);
  }
  res.status(200).json(threads);
};

// GET one thread
const getSingleThread = async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such thread" });
  }
  const thread = await Thread.findById(id).populate("replies");

  if (!thread) {
    return res.status(404).json({ error: "No such thread" });
  }

  res.status(200).json(thread);
};

//GET images
const getImage = async (req, res) => {
  const { imagePath } = req.params;
  readFile(imagePath, async function (err, imageBuffer) {
    if (err) {
      res.writeHead(400);
      console.log(err);
      res.end("No such image");
    } else {
      try {
        if (imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg")) {
          const jpegBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 85 })
            .toBuffer();
          const webpBuffer = await sharp(jpegBuffer).webp().toBuffer();

          res.setHeader("Content-Type", "image/webp");
          res.writeHead(200);
          res.end(webpBuffer);
        } else {
          res.writeHead(200);
          res.end(imageBuffer);
        }
      } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end("Failed to process the image.");
      }
    }
  });
};

//POST a thread
const createThread = async (req, res) => {
  console.log("lancement de createThread");
  if (!req.file) {
    return res.status(400).json({ error: "No file has been downloaded." });
  }

  console.log(`req.file :`);
  console.log(req.file);

  const imagePath = req.file.key;
  console.log(`imagePath :`);
  console.log(imagePath);

  // Télécharger l'image depuis S3
  const imageBuffer = await downloadImageFromS3(imagePath);

  // Valider le type d'image
  const result = await validateImageType(imageBuffer);
  if (!result.ok) {
    console.error(result.error);
    return res.status(400).json({ error: "Invalid file format." });
  }
  const metadata = await getImageMetadata(imageBuffer);
  const { width, height } = metadata;
  try {
    const { opName, subject, comment } = req.body;
    const { size } = req.file;
    const thread = await Thread.create({
      opName,
      subject,
      comment,
      image: imagePath,
      imageWidth: width,
      imageHeight: height,
      imageSize: Math.floor(size / 1000),
      replies: [],
    });
    await thread.save();
    thread.bumpDate = thread.createdAt;
    thread.formatedId = await uniqueIdGeneration();
    await thread.save();

    const allThreads = await Thread.find({}).sort({ bumpDate: 1 });
    const maxThreads = 16;
    if (allThreads.length > maxThreads) {
      await Thread.findByIdAndDelete(allThreads[0]._id);
    }

    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

// PATCH reply
const createReply = async (req, res) => {
  //Image
  let imagePath = null;
  let width = 0;
  let height = 0;
  if (req.file) {
    imagePath = req.file.path;
    const result = await validateImageType(imagePath);
    if (!result.ok) {
      console.error(result.error);
      return res.status(400).json({ error: "Invalid file format." });
    }
    const metadata = await getImageMetadata(imagePath);
    width = metadata.width;
    height = metadata.height;
  }
  size = req.file ? req.file.size : 0;
  // Test ID
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "bad ID" });
  }
  //Creation de la réponse
  const { name, comment } = req.body;
  const newReply = await Reply.create({
    name,
    comment,
    image: imagePath,
    imageWidth: width,
    imageHeight: height,
    imageSize: Math.floor(size / 1000),
    date: Date.now(),
  });
  await newReply.save();

  newReply.formatedId = await uniqueIdGeneration();
  await newReply.save();

  //Le thread
  const thread = await Thread.findById(id);
  if (!thread) {
    return res.status(404).json({ error: "No such thread" });
  }
  //La reponse est-elle une réponse à quelqu'un ?
  try {
    const regex = /(\d{8})/g;
    if (regex.test(comment)) {
      const matches = comment.match(regex);
      let parentReply;
      for (const match of matches) {
        parentReply = await Reply.findOne({
          formatedId: match,
        });
        if (!parentReply) {
          parentReply = await Thread.findOne({
            formatedId: match,
          });
        }
        if (parentReply) {
          parentReply.directReplies.push(newReply.formatedId);
          await parentReply.save();
        } else {
          console.log(`No comment found : ${match}`);
        }
      }
    }

    thread.replies.push(newReply);
    thread.bumpDate = newReply.createdAt;
    await thread.save();
    res.status(200).json(thread);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export { getThreads, getSingleThread, createThread, createReply, getImage };