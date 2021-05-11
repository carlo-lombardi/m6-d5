import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import profileRouter from "./services/profiles/index.js";
import experiencesRouter from "./services/experiences/index.js";
import postsRouter from "./services/posts/index.js";

import { notFoundErrorHandler, badRequestErrorHandler, catchAllErrorHandler } from "./errorHandlers.js";

const server = express();

server.use(express.json());
const port = process.env.PORT;

server.use(cors());

server.use("/profile", profileRouter);
server.use("/profile/experiences", experiencesRouter);
server.use("/posts", postsRouter);

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
