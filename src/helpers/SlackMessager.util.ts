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
      text: `${
        pr.validated ? ":white_check_mark:" : ":warning:"
      } *${convertToLink(message, pr.url)}*`,
    },
  };
};
