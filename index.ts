import { App } from "@slack/bolt";
import { SlackActions } from "./src";
import { config } from "dotenv";

const logger = require("pino")();
config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // add this
  appToken: process.env.SLACK_APP_TOKEN, // add this
  port: parseInt(process.env.PORT as string, 10) || 3000,
});

new SlackActions(app).activate();

async function main() {
  await app.start();
  logger.info("Shipit is ready!");
}

main();
