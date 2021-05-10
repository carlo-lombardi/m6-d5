import express from "express";
import mongoose from "mongoose";
import cloudMulter from "../../middlewares/cloudinary.js";
import ProfileModel from "./schema.js";
import q2m from "query-to-mongo";

const uploadImg = cloudMulter();

const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    if (Object.keys(req.query).length > 0) {
      const query = q2m(req.query);
      const total = await ProfileModel.countDocuments(query.criteria);
      const profiles = await ProfileModel.find(
        {
          name: {
            $regex: new RegExp(query.criteria.name, "i"),
          },
          brand: {
            $regex: new RegExp(query.criteria.brand, "i"),
          },
          category: {
            $regex: new RegExp(query.criteria.category, "i"),
          },
        },
        query.options.fields
      )
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort);

      res.status(200).send({
        links: query.links("/profile", total),
        profiles,
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
    const profiles = await ProfileModel.find();
    res.status(200).send(profiles);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const profiles = await ProfileModel.findById(req.params.id);
    if (profiles) {
      res.send(profiles);
    } else {
      const error = new Error("profiles not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.post("/", uploadImg, async (req, res, next) => {
  console.log("posting");
  try {
    const newprofile = new ProfileModel({
      ...req.body,
      imageUrl: req.file.path,
    });
    const { _id } = await newprofile.save();
    res.status(201).send(_id);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.delete("/:id", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findByIdAndDelete(req.params.id);
    if (profile) {
      res.send("profile deleted!");
    } else {
      const error = new Error(`profiles with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

route.put("/:id", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (profile) {
      res.send(profile);
    } else {
      const error = new Error(`profile with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

export default route;
