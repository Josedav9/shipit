import { App, GenericMessageEvent } from "@slack/bolt";
import { GithubIntegration } from "../integration/github";
import { formatMessageForPullRequest } from "../helpers";
import { User } from "../model/user.model";
import { PullRequestModel } from "@/integration/DTOs/index";
import { PullRequest } from "../model/pullrequest.model";
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
      const incommingMessage = message as GenericMessageEvent;

      try {
        const userInfo = await this.app.client.users.info({
          token: context.botToken!,
          user: incommingMessage.user,
        });

        const githubUser = await User.findOne({
          slackUserId: userInfo.user!.id,
        });

        if (!githubUser) {
          throw new Error(
            `Your slack user doesn't have a github user associated please run ´register <github user>´`
          );
        }
        const getPrs = await PullRequest.find<PullRequestModel>({
          validated: false,
          author: githubUser,
        });
        if (getPrs.length && getPrs.length > 0) {
          const messagePullRequest = getPrs.map((pr) => {
            return formatMessageForPullRequest(pr);
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
          throw new Error(
            `You don't have any Pull request that need validation at the moment :thumbsup:`
          );
        }
      } catch (error: any) {
        await say(error.message);
      }
    });

    this.app.message("register", async ({ context, message, say }) => {
      logger.info("Shipit register access");
      try {
        const incommingMessage = message as GenericMessageEvent;
        const [_, newGithubUser] = incommingMessage.text!.split(" ");

        if (!newGithubUser) {
          throw new Error(`Please provide a github user :thumbsup:`);
        }

        const userInfo = await this.app.client.users.info({
          token: context.botToken!,
          user: incommingMessage.user,
        });

        const githubUser = await User.findOne({
          slackUserId: userInfo.user!.id,
        });

        if (githubUser) {
          await say(
            `You already have a github user register is ${githubUser.githubUser} :thumbsup:`
          );
        } else {
          const newRegister = new User({
            githubUser: newGithubUser,
            slackUserId: userInfo.user!.id,
          });
          await newRegister.save();
          await say(
            `Your user was register with ${newRegister.githubUser} github account :partying_face:`
          );
        }
      } catch (error: any) {
        await say(error.message);
      }
    });

    this.app.message("validate", async ({ context, message, say }) => {
      logger.info("Shipit validate access");
      try {
        const incommingMessage = message as GenericMessageEvent;
        const [_, respository, pullRequest] = incommingMessage.text!.split(" ");

        if (!respository || !pullRequest) {
          throw new Error(`Please provide a repository and a PR number`);
        }

        const pullRequestNumber = parseInt(pullRequest, 10);

        const { data } = await this.github.checkPullRequest(
          respository,
          pullRequestNumber
        );
        // TODO JIRA: AS-48: Add logic to check on db for created PRS need github action before.
        const newPr = new PullRequest({
          title: data.title,
          author: data.user.login,
          url: data.url,
          validated: true,
          repository: respository,
          number: data.number,
        });

        await newPr.save();
        await say(
          `:white_check_mark: Your PR ${newPr.title} #${newPr.number} has been validated :partying_face:`
        );
      } catch (error: any) {
        await say(error.message);
      }
    });

    this.app.message("deploy", async ({ message, say }) => {
      try {
        const incommingMessage = message as GenericMessageEvent;
        const [_, respository, tagName] = incommingMessage.text!.split(" ");
        if (!respository) {
          throw new Error(`Please provide a repository to be deployed!!`);
        }

        // TODO: Check back once issue with merging api is solved
        /* const pr = await this.github.createPullRequestToMain(respository);
        const prNumber = pr.data.number;
        // Issues with github api check https://stackoverflow.com/questions/69489708/github-merging-api-returns-404-not-found
        const data = await this.github.mergePullRequest(respository, prNumber); */

        const { data } = await this.github.createRelease(respository, tagName);
        await say(
          `Your release has been created with the tag ${data.tag_name}`
        );
      } catch (error: any) {
        await say(error.message);
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
