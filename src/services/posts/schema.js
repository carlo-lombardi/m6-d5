import mongoose from "mongoose";
import { CommentSchema } from "./commentSchema.js";

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    image: {
      type: String,
      trim: true,
    },
    comments: [CommentSchema],
    likes: [],
    loves: [],
    celebrates: [],
  },
  { timestamps: true }
);

PostSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
export default model("Post", PostSchema);
