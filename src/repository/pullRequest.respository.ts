import { PullRequestModel } from "../integration/DTOs";
import { PullRequest } from "../model/pullrequest.model";

export const unValidatedPrsByAuthor = (githubUser: string) => {
  return PullRequest.find<PullRequestModel>({
    validated: false,
    author: githubUser,
  });
};

export const updatePRValidated = (
  githubUser: string,
  repository: string,
  number: number
) => {
  return PullRequest.findOneAndUpdate<PullRequestModel>(
    {
      author: githubUser,
      repository,
      number: number,
    },
    { validated: true }
  );
};
