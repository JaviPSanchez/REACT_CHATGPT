import express from "express";
import {} from "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
const port = 3001;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-KgoWqYYrwV6puxuBfCmNCtSg",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  const { message, currentModel } = req.body;
  console.log(message);
  const response = await openai.createCompletion({
    model: `${currentModel}`,
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  });

  res.json({
    data: response.data.choices[0].text,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  console.log(response.data.data);
  res.json({ models: response.data.data });
});

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}!`)
);
