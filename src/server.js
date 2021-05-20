import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import profileRouter from "./services/profiles/index.js";
import experiencesRouter from "./services/experiences/index.js";
import postsRouter from "./services/posts/index.js";
import authenticateToken from "./middlewares/authToken.js";
import authRoute from "./middlewares/auth.js";

import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js";

const server = express();

server.use(express.json());
const port = process.env.PORT;

const whitelist = [process.env.FE_URL_DEV, process.env.FE_URL_PROD];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) === -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

server.use(cors(corsOptions));

server.use("/", authRoute);

server.use("/profile", authenticateToken, profileRouter);
server.use("/profile", authenticateToken, experiencesRouter);
server.use("/posts", authenticateToken, postsRouter);

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
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      if (process.env.NODE_ENV === "production") {
        console.log("Running in the cloud on port", port);
      } else {
        console.log("Running locally on port", port);
      }
    })
  )
  .catch((err) => console.log(err));
