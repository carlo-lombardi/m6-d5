import express from "express";
import mongoose from "mongoose";
import { cloudMulterPosts } from "../../middlewares/cloudinary.js";
import PostModel from "./schema.js";
import q2m from "query-to-mongo";

const uploadImg = cloudMulterPosts();

const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find().populate("user");
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id).populate("user");

    if (post) {
      res.status(200).send(post);
    } else {
      const error = new Error("post not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.post("/", uploadImg, async (req, res, next) => {
  try {
    const newPost = new PostModel({
      ...req.body,
      image: req.file ? req.file.path : null,
    });

    const { _id } = await newPost.save();
    res.status(201).send(newPost);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.put("/:id", uploadImg, async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.file ? { ...req.body, image: req.file.path } : req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (post) {
      res.status(200).send(post);
    } else {
      const error = new Error(
        `The post with id ${req.params.id} was not found`
      );
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.delete("/:id", async (req, res, next) => {
  try {
    const Post = await PostModel.findByIdAndDelete(req.params.id);
    if (Post) {
      res.status(204).send("Post deleted!");
    } else {
      const error = new Error(`Post with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default route;
