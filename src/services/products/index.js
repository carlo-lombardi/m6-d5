import express from "express";
import mongoose from "mongoose";
import { cloudMulter } from "./cloudinary.js";
import ProductsModel from "./schema.js";

const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.find();
    res.send(products);
  } catch (err) {
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
    next(err);
  }
});

route.post("/", cloudMulter.single("productImg"), async (req, res, next) => {
  try {
    const newProduct = new ProductsModel({
      ...req.body,
      imageUrl: req.file.path,
    });
    const { _id } = await newProduct.save();
    res.status(201).send(_id);
  } catch (err) {
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
    const product = await ProductsModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
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
    const { reviews } = await ProductsModel.findById(id, { reviews: 1, _id: 0 });
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
export default route;
