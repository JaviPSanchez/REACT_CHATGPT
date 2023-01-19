import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;
dotenv.config();

//Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-KgoWqYYrwV6puxuBfCmNCtSg",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  const { message, selected, tokens } = req.body;
  console.log(req.body);
  const response = await openai.createCompletion({
    model: `${selected}`,
    prompt: `${message}`,
    max_tokens: tokens,
    temperature: 0.5,
  });

  res.json({
    data: response.data.choices[0].text,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  res.json({ models: response.data.data });
});

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}!`)
);
