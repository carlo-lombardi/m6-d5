import express from "express";
import mongoose from "mongoose";
import { cloudMulter } from "./cloudinary.js";
import ProductsModel from "./schema.js";
import q2m from "query-to-mongo";

const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    if (Object.keys(req.query).length > 0) {
      const query = q2m(req.query);
      const total = await ProductsModel.countDocuments(query.criteria);
      const products = await ProductsModel.find(
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
        links: query.links("/products", total),
        products,
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
    const products = await ProductsModel.find();
    res.status(200).send(products);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const products = await ProductsModel.findById(req.params.id);
    if (products) {
      res.send(products);
    } else {
      const error = new Error("products not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.post("/", cloudMulter.single("productImg"), async (req, res, next) => {
  console.log("posting");
  try {
    const newProduct = new ProductsModel({
      ...req.body,
      imageUrl: req.file.path,
    });
    const { _id } = await newProduct.save();
    res.status(201).send(_id);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

route.delete("/:id", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByIdAndDelete(req.params.id);
    if (product) {
      res.send("product deleted!");
    } else {
      const error = new Error(`products with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

route.put("/:id", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (product) {
      res.send(product);
    } else {
      const error = new Error(`product with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

route.get("/:id/reviews", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { reviews } = await ProductsModel.findById(id, {
      reviews: 1,
      _id: 0,
    });
    if (reviews) {
      res.send(reviews);
    } else {
      res.send("No reviews");
    }
  } catch (error) {
    console.log(error);
    next("While reading reviews list a problem occurred!");
  }
});

route.get("/:id/reviews/:reviewId", async (req, res, next) => {
  console.log("okay reviewId", req.params.reviewId);
  try {
    const { reviews } = await ProductsModel.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      {
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    );
    if (reviews) {
      res.send(reviews[0]);
    } else {
      res.send("No review with that ID");
    }
  } catch (error) {
    console.log(error);
    next("While reading reviews list a problem occurred!");
  }
});

route.post("/:id", async (req, res, next) => {
  console.log(`hello ${req.params.id} review post`);
  try {
    const updated = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: req.body,
        },
      },
      { runValidators: true, new: true }
    );
    res.send(updated);
  } catch (error) {
    next(error);
  }
});

route.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  console.log("deleting review");
  try {
    const updated = await ProductsModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      {
        $pull: {
          reviews: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      },
      { new: true }
    );
    res.send(updated);
  } catch (error) {
    next(error);
  }
});

export default route;
