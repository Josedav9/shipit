import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { PullRequestDTO } from "../src/integration/DTOs";
import { PullRequest } from "../src/model/pullrequest.model";
import { MongooseBootstrap } from "../src/config/mongoose";

config();
const app = express();

const port = 3001;

// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]: ${req.method} ${req.url} `);
  next();
});
app.use((err, req, res) => {
  console.log(err);
});

app.post("/", (req, res) => {
  console.log(req.body.challenge);
  res.json({
    challenge: req.body?.challenge,
  });
});

app.post("/webhook", async (req, res, next) => {
  const data: PullRequestDTO = req.body;
  try {
    if (data.merged_at && data.base?.ref === "development") {
      const newPullRequest = new PullRequest({
        title: data.title,
        author: data.user.login,
        url: data.html_url,
        repository: data.repository.name,
        number: data.number,
      });
      await newPullRequest.save();
    }
    res.status(200);
  } catch (error) {
    next(error);
  }
});

app.listen(port, async () => {
  await new MongooseBootstrap().connect();
  console.log(`Example app listening on port ${port}`);
});
