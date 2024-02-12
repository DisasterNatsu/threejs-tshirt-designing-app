import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

interface OpenAIImageResponse {
  data: {
    data: {
      b64_json: string; // Assuming b64_json is a base64 encoded image string
    }[];
  };
}

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAPI_API_KEY,
});

router.route("/").get((req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from Dall.E Routes" });
});

router.route("/post").post(async (req: Request, res: Response) => {
  const { prompt } = req.body;
  console.log(req.body);

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    console.log(response);

    const imageBase64 = response.data[0].b64_json;

    return res.status(200).json({ photo: imageBase64 });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
