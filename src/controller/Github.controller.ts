import {
  App,
  SlackEventMiddlewareArgs,
  AllMiddlewareArgs,
  GenericMessageEvent,
} from "@slack/bolt";
import { PullRequestModel } from "../integration/DTOs/index";
import { PullRequest } from "../model/pullrequest.model";
import { formatMessageForPullRequest } from "../helpers";
import { GithubIntegration } from "../integration/github";
import {
  findUserBySlackId,
  createNewUser,
  findUsersByGithubId,
} from "../repository/user.respository";
import {
  unValidatedPrsByAuthor,
  updatePRValidated,
} from "../repository/pullRequest.respository";

export class GithubController {
  app: App;
  github: GithubIntegration;

  constructor(app: App, github: GithubIntegration) {
    this.app = app;
    this.github = github;
  }

  async listPrs({
    context,
    message,
    say,
  }: SlackEventMiddlewareArgs<"message"> & AllMiddlewareArgs) {
    const incommingMessage = message as GenericMessageEvent;

    try {
      const userInfo = await this.app.client.users.info({
        token: context.botToken!,
        user: incommingMessage.user,
      });

      const user = await findUserBySlackId(userInfo.user!.id!);

      if (!user) {
        throw new Error(
          `Your slack user doesn't have a github user associated please run ´register <github user>´`
        );
      }
      const getPrs = await unValidatedPrsByAuthor(user.githubUser);
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
  }

  async registerEvent({
    context,
    message,
    say,
  }: SlackEventMiddlewareArgs<"message"> & AllMiddlewareArgs) {
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

      const githubUser = await findUserBySlackId(userInfo.user!.id!);

      if (githubUser) {
        await say(
          `You already have a github user register is ${githubUser.githubUser} :thumbsup:`
        );
      } else {
        const newRegister = await createNewUser(
          newGithubUser,
          userInfo.user!.id!
        );
        await say(
          `Your user was register with ${newRegister.githubUser} github account :partying_face:`
        );
      }
    } catch (error: any) {
      await say(error.message);
    }
  }

  async validate({
    context,
    message,
    say,
  }: SlackEventMiddlewareArgs<"message"> & AllMiddlewareArgs) {
    try {
      const incommingMessage = message as GenericMessageEvent;
      const [_, respository, pullRequest] = incommingMessage.text!.split(" ");

      if (!respository || !pullRequest) {
        throw new Error(`Please provide a repository and a PR number`);
      }

      const userInfo = await this.app.client.users.info({
        token: context.botToken!,
        user: incommingMessage.user,
      });

      const user = await findUserBySlackId(userInfo.user!.id!);

      if (!user) {
        throw new Error(
          "Your slack user doesn't have a github user associated please run ´register <github user>´"
        );
      }

      const pullRequestNumber = parseInt(pullRequest, 10);

      const validatedPr = await updatePRValidated(
        user.githubUser,
        respository,
        pullRequestNumber
      );

      if (!validatedPr) {
        throw new Error(
          ":poop: We could not find your PR please check the information is correct an try again :thumbsup:"
        );
      }

      await say(
        `:white_check_mark: Your PR ${validatedPr.title} #${validatedPr.number} has been validated :partying_face:`
      );
    } catch (error: any) {
      await say(error.message);
    }
  }

  async deploy({
    context,
    message,
    say,
  }: SlackEventMiddlewareArgs<"message"> & AllMiddlewareArgs) {
    try {
      const incommingMessage = message as GenericMessageEvent;
      const [_, repository, tagName] = incommingMessage.text!.split(" ");
      if (!repository) {
        throw new Error(`Please provide a repository to be deployed!!`);
      }

      // TODO: Check back once issue with merging api is solved
      /* const pr = await this.github.createPullRequestToMain(respository);
      const prNumber = pr.data.number;
      // Issues with github api check https://stackoverflow.com/questions/69489708/github-merging-api-returns-404-not-found
      const data = await this.github.mergePullRequest(respository, prNumber); */

      const prsToBeDeployed = await PullRequest.find<PullRequestModel>({
        prod: false,
        repository,
      });
      if (!prsToBeDeployed.length) {
        throw new Error("*Looks like there are no new changes to be deploy*");
      }

      const PrsNotValidated = prsToBeDeployed
        .filter((pr) => pr.validated === false)
        .map((pr) => ({ id: pr._id, author: pr.author }));

      const messagePullRequest = prsToBeDeployed.map((pr) => {
        return formatMessageForPullRequest(pr);
      });

      await say({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*PRs for this deployment :rocket:*\n We send a notification to all PRs that need validation",
            },
          },
          ...messagePullRequest,
        ],
      });

      if (PrsNotValidated.length) {
        const githubAuthors = PrsNotValidated.map((pr) => pr.author);
        const users = await findUsersByGithubId(githubAuthors);
        const pinMessages = users.map((user) =>
          /* say(`Hey there <@${user.slackUserId}>! we need you validation on some of the PRs above`) */
          this.app.client.chat.postMessage({
            channel: user.slackUserId,
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*There is someone prepping a deployment :rocket:*\n You have pendding Prs Please run `prs` to check the prs that need validation from you",
                },
              },
            ],
          })
        );
        await Promise.all(pinMessages);
        throw new Error(
          "There are PRs that need to be validated before. We send a notification to all those users"
        );
      }

      const { data } = await this.github.createRelease(repository, tagName);

      await PullRequest.updateMany({ repository }, { prod: true });

      await say(`Your release has been created with the tag ${data.tag_name}`);
    } catch (error: any) {
      await say(error.message);
    }
  }
}
