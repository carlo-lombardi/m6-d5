import express from "express";
import mongoose from "mongoose";
import cloudMulter from "../../middlewares/cloudinary.js";
import ExperienceModel from "./schema.js";
import q2m from "query-to-mongo";

const uploadImg = cloudMulter();

const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    if (Object.keys(req.query).length > 0) {
      const query = q2m(req.query);
      const totalExperiences = await ExperienceModel.countDocuments(
        query.criteria
      );
      const experiences = await ExperienceModel.find(
        {
          role: {
            $regex: new RegExp(query.criteria.role, "i"),
          },
          company: {
            $regex: new RegExp(query.criteria.company, "i"),
          },
          username: {
            $regex: new RegExp(query.criteria.username, "i"),
          },
        },
        query.options.fields
      )
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort);

      res.status(200).send({
        links: query.links("/experiences", totalExperiences),
        experiences,
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.get("/", async (req, res, next) => {
  try {
    const experiences = await ExperienceModel.find();
    res.status(200).send(experiences);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const experiences = await ExperienceModel.findById(req.params.id);
    if (experiences) {
      res.send(experiences);
    } else {
      const error = new Error("experiences not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});
/* route.post("/", async (req, res, next) => {
  try {
    const newExperience = new ExperienceModel({
      ...req.body,
    });
    const { _id } = await newExperience.save();
    res.status(201).send(_id);
  } catch (err) {
    console.log(err);
    next(err);
  }
}); */
route.post("/", uploadImg, async (req, res, next) => {
  console.log("posting");
  try {
    const newExperience = new ExperienceModel({
      ...req.body,
      imageUrl: req.file.path,
    });
    const { _id } = await newExperience.save();
    res.status(201).send(_id);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.delete("/:id", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByIdAndDelete(req.params.id);
    if (experience) {
      res.send("experience deleted!");
    } else {
      const error = new Error(`experiences with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

route.put("/:id", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (experience) {
      res.send(experience);
    } else {
      const error = new Error(`experience with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

export default route;
