import { App } from "@slack/bolt";
import { SlackActions } from "./src";
import { config } from "dotenv";
import { MongooseBootstrap } from "./src/config/mongoose";

const logger = require("pino")();
config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN, // add this
  port: process.env.BOT_PORT as any,
  customRoutes: [
    {
      path: '/health',
      method: ['GET'],
      handler: (req, res) => {
        res.writeHead(200);
        res.end('Im working');
      },
    },
  ],
});

new SlackActions(app).activate();

async function main() {
  try {
    await new MongooseBootstrap().connect();
    await app.start();
  } catch (err) {
    console.log(err);
  }
  logger.info("Shipit is ready!");
}

main();
