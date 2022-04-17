import { PullRequestDTO } from "@/integration/DTOs";

export const convertToLink = (title: string, url: string) => {
  return `<${url}|${title}>`;
};

export const formatMessageForPullRequest = (pr: PullRequestDTO) => {
  const number = pr.number;
  const repoName = pr.repo.name;
  const message = `${repoName} #${number} ${pr.title}`;
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
};
