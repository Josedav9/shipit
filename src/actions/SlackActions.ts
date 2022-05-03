import { App, GenericMessageEvent } from "@slack/bolt";
import { GithubIntegration } from "../integration/github";
import { GithubController } from "../controller/Github.controller";
const logger = require("pino")({ name: "ShipitBot slack" });

export class SlackActions {
  app: App;
  github: GithubIntegration;
  githubController: GithubController;

  constructor(app: App) {
    this.app = app;
    this.github = new GithubIntegration({ owner: "Josedav9" });
    this.githubController = new GithubController(this.app, this.github);
  }

  activate() {
    logger.info("ShipitBot module is now active.");

    this.app.message("prs", (event) => this.githubController.listPrs(event));

    this.app.message("register", (event) => this.githubController.registerEvent(event));

    this.app.message("validate", (event) => this.githubController.validate(event));

    this.app.message("deploy", (event) => this.githubController.deploy(event));

    // Listens to incoming messages that contain "hello"
    this.app.message("hello", async ({ message, say }) => {
      // say() sends a message to the channel where the event was triggered
      const user = (message as GenericMessageEvent).user;
      await say(`Hey there <@${user}>!`);
    });
  }
}
