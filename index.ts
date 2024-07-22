import bodyParser from "body-parser";
import express, { Application } from "express";
import { Routes } from "./src/components/Routes";
import Middleware from "./src/components/Middleware";
import dotenv from "dotenv";

const app: Application = express();

app.use(bodyParser.json());
dotenv.config({ path: "./config.env" });
dotenv.config({ path: "./redis.env" });
const middleware = new Middleware();
app.use(middleware.beforeHandleRequest.bind(middleware));

const router = new Routes();
app.use(router.getRoutes());
app.use(middleware.errorHandler.bind(middleware));

app.listen(4242, () => {
  console.log("Server is up & running on 4242");
});
