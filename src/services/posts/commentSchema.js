import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model("Comment", CommentSchema);
