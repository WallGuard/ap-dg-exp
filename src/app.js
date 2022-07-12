require("dotenv").config();

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import setRoutes from "./routes/index";
import errorHandler from './utils/errorHandler';

// import { readFileSync } from "fs";
// const bodyParser = require('body-parser');

const app = express();

app.use(cors({credentials: true, origin: true}));
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.unsubscribe(cookieParser());
app.use(errorHandler);

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

setRoutes(app);

export default app;
