import express from "express";
import mongoose from "mongoose";
import cloudMulter from "../../middlewares/cloudinary.js";
import ProfileModel from "./schema.js";
import ExperienceModel from "..//experiences/schema.js";
import q2m from "query-to-mongo";
//import pdf from "pdf-creator-node";
import fs from "fs";
import pdf from "html-pdf";
import jwt from "jsonwebtoken";
import axios from "axios";
import pdfTemplate from "./pdf-template.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const uploadImg = cloudMulter();

const route = express.Router();

const currentWorkingFile = fileURLToPath(import.meta.url);
const currentWorkingDirectory = dirname(currentWorkingFile);

route.get("/me", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = (req.userData = decoded).sub;

    await axios
      .get(`http://localhost:3001/profile/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const updatedUser = response.data;
        res.status(200).send(updatedUser);
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

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
  const defaultProfileImageUrl =
    "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";
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
    const profile = await ProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (profile) {
      res.status(200).send(profile);
    } else {
      const error = new Error(
        `The profile with id ${req.params.id} was not found`
      );
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

route.get("/:id/cv", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findById(req.params.id);
    const experience = await ExperienceModel.find({
      user: mongoose.Types.ObjectId(req.params.id),
    });

    if (profile) {
      /* const html = fs.readFileSync(join(currentWorkingDirectory, "./html/index.html"), "utf-8");
      var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
      };

      var document = {
        html: html,
        data: {
          profile: profile,
          experience: experience,
        },
        path: "./output.pdf",
        type: "",
        allowProtoMethodsByDefault: true,
      };

      pdf
        .create(document, options)
        .then((result) => {
          console.log(result);
          res.sendFile(result.filename);
        })
        .catch((error) => {
          console.error(error);
        }); */
      pdf
        .create(pdfTemplate(profile, experience), { format: "A3" })
        .toFile(`cv.pdf`, (err) => {
          if (err) {
            console.log(err);
          } else {
            const file = join(currentWorkingDirectory, "../../../cv.pdf");
            res.sendFile(file);
          }
        });
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

export default route;
