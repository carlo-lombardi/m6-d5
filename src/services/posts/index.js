import express from "express";
import mongoose from "mongoose";
import { cloudMulterPosts } from "../../middlewares/cloudinary.js";
import PostModel from "./schema.js";
import q2m from "query-to-mongo";
import CommentSchema from "./commentSchema.js";

const uploadImg = cloudMulterPosts();

const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find().populate("user");
    res.status(200).send(posts);
  } catch (err) {
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
    next(err);
  }
});

// comments

route.post(
  "/:postId/user/:userId/comment",
  uploadImg,
  async (req, res, next) => {
    try {
      const post = await PostModel.findById(req.params.postId);
      if (post) {
        const comment = new CommentSchema(req.body);
        const newComment = {
          ...comment.toObject(),
          image: req.file ? req.file.path : null,
        };
        await PostModel.findByIdAndUpdate(
          req.params.postId,
          {
            $push: {
              comments: { ...newComment, user: req.params.userId },
            },
          },
          {
            runValidators: true,
            new: true,
          }
        );
        res.status(201).send(newComment);
      }
    } catch (err) {
      next(err);
    }
  }
);
route.put(
  "/:postId/user/:userId/comment/:commentId",
  uploadImg,
  async (req, res, next) => {
    try {
      const editedComment = await PostModel.findOneAndUpdate(
        {
          _id: req.params.postId,
          "comments._id": req.params.commentId,
        },
        {
          $set: {
            "comments.$.comment": req.body.comment,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );

      res.status(201).send(editedComment);
    } catch (err) {
      next(err);
    }
  }
);
route.delete(
  "/:postId/user/:userId/comment/:commentId",
  async (req, res, next) => {
    try {
      const findComment = await PostModel.findByIdAndUpdate(
        {
          _id: req.params.postId,
        },
        {
          $pull: {
            comments: { _id: req.params.commentId },
          },
        },
        { new: true }
      );

      res.status(201).send(findComment);
    } catch (err) {
      next(err);
    }
  }
);

// Reactions

route.post("/:postId/user/:userId/like", async (req, res, next) => {
  try {
    const urlArray = req.originalUrl.split("/");
    const reaction = urlArray[urlArray.length - 1];

    const finalReaction = reaction === "thoughtful" ? reaction : reaction + "s";

    const post = await PostModel.findById(req.params.postId);

    const newArray = `${finalReaction}`;

    if (!post[finalReaction].includes(req.params.userId)) {
      const removed = await PostModel.findOneAndUpdate(
        {
          _id: req.params.postId,
        },
        {
          $pull: {
            likes: req.params.userId,
            loves: req.params.userId,
            celebrates: req.params.userId,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      const editedPost = await PostModel.findOneAndUpdate(
        {
          _id: req.params.postId,
        },
        {
          $push: {
            [newArray]: req.params.userId,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      return res.status(201).send(editedPost);
    } else {
      const deleteReaction = await PostModel.findByIdAndUpdate(
        req.params.postId,
        {
          $pull: {
            [newArray]: req.params.userId,
          },
        },

        {
          runValidators: true,
          new: true,
        }
      );
      return res.status(204).send(deleteReaction);
    }
  } catch (error) {
    next(error);
  }
});
route.post("/:postId/user/:userId/celebrate", async (req, res, next) => {
  try {
    const urlArray = req.originalUrl.split("/");
    const reaction = urlArray[urlArray.length - 1];

    const finalReaction = reaction === "thoughtful" ? reaction : reaction + "s";

    const post = await PostModel.findById(req.params.postId);

    const newArray = `${finalReaction}`;

    if (!post[finalReaction].includes(req.params.userId)) {
      const removed = await PostModel.findOneAndUpdate(
        {
          _id: req.params.postId,
        },
        {
          $pull: {
            likes: req.params.userId,
            loves: req.params.userId,
            celebrates: req.params.userId,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      const editedPost = await PostModel.findOneAndUpdate(
        {
          _id: req.params.postId,
        },
        {
          $push: {
            [newArray]: req.params.userId,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      return res.status(201).send(editedPost);
    } else {
      const deleteReaction = await PostModel.findByIdAndUpdate(
        req.params.postId,
        {
          $pull: {
            [newArray]: req.params.userId,
          },
        },

        {
          runValidators: true,
          new: true,
        }
      );
      return res.status(204).send(deleteReaction);
    }
  } catch (error) {
    next(error);
  }
});
route.post("/:postId/user/:userId/love", async (req, res, next) => {
  try {
    const urlArray = req.originalUrl.split("/");
    const reaction = urlArray[urlArray.length - 1];

    const finalReaction = reaction === "thoughtful" ? reaction : reaction + "s";

    const post = await PostModel.findById(req.params.postId);

    const newArray = `${finalReaction}`;

    if (!post[finalReaction].includes(req.params.userId)) {
      const removed = await PostModel.findOneAndUpdate(
        {
          _id: req.params.postId,
        },
        {
          $pull: {
            likes: req.params.userId,
            loves: req.params.userId,
            celebrates: req.params.userId,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      const editedPost = await PostModel.findOneAndUpdate(
        {
          _id: req.params.postId,
        },
        {
          $push: {
            [newArray]: req.params.userId,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
      return res.status(201).send(editedPost);
    } else {
      const deleteReaction = await PostModel.findByIdAndUpdate(
        req.params.postId,
        {
          $pull: {
            [newArray]: req.params.userId,
          },
        },

        {
          runValidators: true,
          new: true,
        }
      );
      return res.status(204).send(deleteReaction);
    }
  } catch (error) {
    next(error);
  }
});

export default route;
