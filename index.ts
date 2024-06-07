import bodyParser from "body-parser";
import express, { Application } from "express";
import { Routes } from "./src/Routes";
import Middleware from "./src/Middleware";
import dotenv from "dotenv";

const app: Application = express();

app.use(bodyParser.json());
dotenv.config({ path: "./config.env" });
const middleware = new Middleware();
app.use(middleware.beforeHndleRequest.bind(middleware));

const router = new Routes();
app.use(router.getRoutes());

app.listen(4242, () => {
  console.log("Server is up & running on 4242");
});
