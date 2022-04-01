import express from "express";
import bodyParser from 'body-parser'

const app = express();

const port = 3000;

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]: ${req.method} ${req.url} `);
  next();
});

app.post("/", (req, res) => {
  console.log(req.body.challenge);
  res.json({
    challenge: req.body?.challenge,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
