import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ExperienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
      trim: true,
      min: "1920-01-01",
      max: "2200-12-31",
    },
    endDate: {
      type: Date,
      trim: true,
      min: "1920-01-01",
      max: "2200-12-31",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

ExperienceSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
export default model("Experience", ExperienceSchema);
