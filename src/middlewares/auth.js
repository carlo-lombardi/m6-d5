import express from "express";
import jwt from "jsonwebtoken";
import ProfileModel from "../services/profiles/schema.js";
import bcrypt from "bcrypt";

const route = express.Router();

route.post("/login", async (req, res, next) => {
  try {
    const foundUser = await ProfileModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    }).select("password");

    if (foundUser) {
      const verified = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (verified) {
        const accessToken = generateAccessToken(foundUser);
        res.json({ accessToken: accessToken });
      } else {
        res.status(404);
      }
    }
  } catch (error) {
    next(error);
  }
});

function generateAccessToken(foundUser) {
  return jwt.sign({ sub: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60m",
  });
}

route.post("/register", async (req, res, next) => {
  try {
    const hashPwd = await bcrypt.hash(
      req.body.password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const newUser = await ProfileModel.create({
      ...req.body,
      password: hashPwd,
    });

    const accessToken = jwt.sign(
      { sub: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(201).send({
      accessToken: `${accessToken}`,
    });
  } catch (error) {
    next(error);
  }
});

route.delete("/logout", (req, res) => {
  // needs more work
  accessToken = accessToken.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

export default route;
