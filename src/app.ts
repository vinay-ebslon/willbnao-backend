import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import routeV1 from "./v1/route.v1";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());



app.use("/v1", routeV1);

void connectDB();

export default app;
