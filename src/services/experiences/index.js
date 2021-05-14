import express from "express";
import mongoose from "mongoose";
import { cloudMulterExp } from "../../middlewares/cloudinary.js";
import ExperienceModel from "./schema.js";
import ProfileModel from "../profiles/schema.js";
import q2m from "query-to-mongo";
import json2csv from "json2csv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// const csv = require("csv");
const json2csvParser = json2csv.Parser;
import fs from "fs-extra";

const uploadImg = cloudMulterExp();

const route = express.Router();

route.get("/:userId/experiences", async (req, res, next) => {
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
          area: {
            $regex: new RegExp(query.criteria.area, "i"),
          },
          description: {
            $regex: new RegExp(query.criteria.description, "i"),
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

route.get("/:userId/experiences", async (req, res, next) => {
  try {
    const experiences = await ExperienceModel.find({
      user: mongoose.Types.ObjectId(req.params.userId),
    });
    console.log(experiences);
    res.status(200).send(experiences);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
route.get("/:userId/experiences/CSV", async (req, res, next) => {
  try {
    const csvFields = await ExperienceModel.find({
      user: mongoose.Types.ObjectId(req.params.userId),
    });
    if (csvFields) {
      const jsonData = JSON.parse(JSON.stringify(csvFields));
      const fields = [
        "_id",
        "role",
        "company",
        "description",
        "startDate",
        "endDate",
      ];
      const JSON2CSVParsing = new json2csvParser({ fields });
      console.log(JSON2CSVParsing);
      const csvData = JSON2CSVParsing.parse(jsonData);
      const pathExpData = join(
        dirname(fileURLToPath(import.meta.url)),
        "./csv/ExperienceData.csv"
      );
      fs.writeFile(pathExpData, csvData, function (error) {
        if (error) throw error;
        console.log("successfully!");
      });
      res.set("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=ExperienceData.csv"
      );
      res.status(200).send(csvFields);
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

route.get("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const experiences = await ExperienceModel.find({
      user: mongoose.Types.ObjectId(req.params.userId),
      _id: mongoose.Types.ObjectId(req.params.expId),
    });
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
route.post("/:userId/experiences", async (req, res, next) => {
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
});
route.post(
  "/:userId/experiences/:expId/picture",
  uploadImg,
  async (req, res, next) => {
    try {
      const newExperience = await ExperienceModel.findByIdAndUpdate(
        req.params.expId,
        { image: req.file.path },
        {
          runValidators: true,
          new: true,
        }
      );
      const { _id } = await newExperience.save();
      res.status(201).send(`image with the experience ${_id} was added `);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

route.delete("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByIdAndDelete(
      req.params.expId
    );
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

route.put("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findByIdAndUpdate(
      req.params.expId,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (experience) {
      res.send(experience);
    } else {
      const error = new Error(
        `experience with id ${req.params.expId} not found`
      );
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

export default route;
