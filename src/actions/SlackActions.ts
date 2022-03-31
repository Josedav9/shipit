import { App, GenericMessageEvent } from "@slack/bolt";
const logger = require("pino")({ name: "ShipitBot slack" });

export class SlackActions {
  app: App;

  constructor(app: App) {
    this.app = app;
  }

  activate() {
    logger.info("ShipitBot module is now active.");

    this.app.message(
      'prs',
      async ({ context, message, say }) => {
        logger.info("Shipit greetings access");
        const userInfo = await this.app.client.users.info({
          token: context.botToken!,
          user: (message as GenericMessageEvent).user,
        });
        await say(`Hellooo there ${userInfo?.user?.name}`);
      }
    );

    // Listens to incoming messages that contain "hello"
    this.app.message("hello", async ({ message, say }) => {
      // say() sends a message to the channel where the event was triggered
      const user = (message as GenericMessageEvent).user
      await say(`Hey there <@${user}>!`);
    });
  }
}
