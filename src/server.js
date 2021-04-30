import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import productsRouter from "./services/products/index.js";

import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js";

const server = express();

server.use(express.json());
const port = process.env.PORT;

server.use(cors());

server.use("/products", productsRouter);

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
