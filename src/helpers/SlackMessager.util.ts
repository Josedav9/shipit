import { PullRequestModel } from "@/integration/DTOs";

export const convertToLink = (title: string, url: string) => {
  return `<${url}|${title}>`;
};

export const formatMessageForPullRequest = (pr: PullRequestModel) => {
  const number = pr.number;
  const repoName = pr.repository;
  const message = `${repoName} #${number} ${pr.title}`;
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `:warning: *${convertToLink(message, pr.url)}*`,
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
};
