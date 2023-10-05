const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const counterSchema = new Schema({
  value: { type: Number, default: 0 },
});

const replySchema = new Schema(
  {
    formatedId: {
      type: String,
    },
    name: {
      type: String,
      required: false,
      default: "Anonymous",
    },
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    imageWidth: {
      type: Number,
      required: false,
    },
    imageHeight: {
      type: Number,
      required: false,
    },
    imageSize: {
      type: Number,
      required: false,
    },
    directReplies: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const threadSchema = new Schema(
  {
    formatedId: {
      type: String,
    },
    opName: {
      type: String,
      required: false,
      default: "Anonymous",
    },
    subject: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: false,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    imageWidth: {
      type: Number,
      required: false,
    },
    imageHeight: {
      type: Number,
      required: false,
    },
    imageSize: {
      type: Number,
      required: false,
    },
    bumpDate: {
      type: Date,
      default: null,
    },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    directReplies: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Counter = mongoose.model("Counter", counterSchema);
const Thread = mongoose.model("Thread", threadSchema);
const Reply = mongoose.model("Reply", replySchema);

module.exports = { Thread, Reply, Counter };
