import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ReviewSchema = new Schema({ timestamps: true });

ReviewSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
export default model("Review", ReviewSchema);
