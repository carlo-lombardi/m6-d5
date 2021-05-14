import express from "express";
import jwt from "jsonwebtoken";
import ProfileModel from "../services/profiles/schema.js";

const route = express.Router();

route.post("/login", async (req, res, next) => {
  const user = await ProfileModel.find({
    $and: [
      { $or: [{ username: req.body.username }, { email: req.body.email }] },
      { password: req.body.password },
    ],
  });

  if (user.length === 1) {
    const accessToken = generateAccessToken(user);

    res.json({ id: user[0]._id, accessToken: accessToken });
  } else {
    res.status(404);
  }
});

function generateAccessToken(user) {
  return jwt.sign({ sub: user[0]._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
}

route.post("/register", async (req, res, next) => {
  const newUser = await ProfileModel.create(req.body);
  if (newUser) {
    const accessToken = jwt.sign(
      { sub: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(201).send({
      id: `${newUser._id}`,
      accessToken: `${accessToken}`,
    });
  }
});

route.delete("/logout", (req, res) => {
  // needs more work
  accessToken = accessToken.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

export default route;
