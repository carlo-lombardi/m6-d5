import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "Profile" },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model("Comment", CommentSchema);
