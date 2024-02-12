import express, { Request, Response } from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import dalleRoutes from "./routes/dalle.routes";

const app: Express = express(); // declare app

// // initialize env

dotenv.config();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
); // urlEncoded and max size of body

app.use("/api/v1/dalle", dalleRoutes);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listning on port ${process.env.PORT || 8080}`);
});
