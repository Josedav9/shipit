import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema({
  githubUser: String,
  slackUserId: String,
});

export const User = mongoose.model("User", user);
