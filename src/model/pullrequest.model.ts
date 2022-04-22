import mongoose from "mongoose";
const { Schema } = mongoose;

const pullRequest = new Schema({
  title: String,
  author: String,
  url: String,
  date: { type: Date, default: Date.now },
  validated: { type: Boolean, default: false },
  repository: String,
  number: Number,
  prod: { type: Boolean, default: false }
});

export const PullRequest = mongoose.model("PullRequest", pullRequest);
