import axios from "axios";
import { PullRequestDTO } from './DTOs'

export class GithubIntegration {
  owner: string;

  constructor({ owner }: { owner: string }) {
    this.owner = owner;
  }

  getPRs(repository: string) {
    return axios.get<PullRequestDTO[]>(
      `https://api.github.com/repos/${this.owner}/${repository}/pulls`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }
    );
  }
}
