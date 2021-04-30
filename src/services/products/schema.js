import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProductSchema = new Schema({ timestamps: true });

ProductSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
export default model("Product", ProcuctSchema);
