import { App, GenericMessageEvent } from "@slack/bolt";
import { GithubIntegration } from "../integration/github";
import { convertToLink } from "../helpers";
const logger = require("pino")({ name: "ShipitBot slack" });

export class SlackActions {
  app: App;
  github: GithubIntegration;

  constructor(app: App) {
    this.app = app;
    this.github = new GithubIntegration({ owner: "Josedav9" });
  }

  activate() {
    logger.info("ShipitBot module is now active.");

    this.app.message("prs", async ({ context, message, say }) => {
      logger.info("Shipit greetings access");
      const userInfo = await this.app.client.users.info({
        token: context.botToken!,
        user: (message as GenericMessageEvent).user,
      });

      try {
        const PRs = await this.github.getPRs("shipit");
        if (PRs.data.length && PRs.data.length > 0) {
          const messagePullRequest = PRs.data.map((pr) => {
            const number = pr.url.split('/')[7]
            const repoName = pr.url.split('/')[5]
            const message = `${repoName} #${number} ${pr.title}`
            return {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `:warning: *${convertToLink(message, pr.html_url)}*`,
              },
              accessory: {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: ":thumbsup: Validate",
                },
                style: "primary",
                value: pr.url,
              },
            };
          });
          await say({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*Pendding PRs :poop:*\n To validate use the coressponding button",
                },
              },
              ...messagePullRequest,
            ],
          });
        } else {
          await say(
            `You don't have any Pull request that need validation at the moment :thumbsup:`
          );
        }
      } catch (error: any) {
        throw new Error(error);
      }
    });

    // Listens to incoming messages that contain "hello"
    this.app.message("hello", async ({ message, say }) => {
      // say() sends a message to the channel where the event was triggered
      const user = (message as GenericMessageEvent).user;
      await say(`Hey there <@${user}>!`);
    });
  }
}
