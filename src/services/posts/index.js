import express from "express";
import mongoose from "mongoose";
import { cloudMulterPosts } from "../../middlewares/cloudinary.js";
import PostModel from "./schema.js";
import q2m from "query-to-mongo";

const uploadImg = cloudMulterPosts();

const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find();
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default route;
