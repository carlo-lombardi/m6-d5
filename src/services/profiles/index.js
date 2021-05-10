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
          surname: {
            $regex: new RegExp(query.criteria.surname, "i"),
          },
          email: {
            $regex: new RegExp(query.criteria.email, "i"),
          },
          title: {
            $regex: new RegExp(query.criteria.title, "i"),
          },
          area: {
            $regex: new RegExp(query.criteria.area, "i"),
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
      res.status(200).send(profiles);
    } else {
      const error = new Error("profile not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.post("/", async (req, res, next) => {
  console.log("posting new profile");
  const defaultProfileImageUrl = "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";
  try {
    const newProfile = new ProfileModel({
      ...req.body,
      image: defaultProfileImageUrl,
    });

    const { _id } = await newProfile.save();
    res.status(201).send(`New profile with ${_id} created successfully`);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.post("/:id/picture", uploadImg, async (req, res, next) => {
  console.log("changing profile picture");
  try {
    const editedProfile = await ProfileModel.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      {
        runValidators: true,
        new: true,
      }
    );

    const { _id } = await editedProfile.save();
    res.status(201).send(editedProfile);
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
    const profile = await ProfileModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (profile) {
      res.status(200).send(profile);
    } else {
      const error = new Error(`The profile with id ${req.params.id} was not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

export default route;
