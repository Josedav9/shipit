import axios from "axios";
import { PullRequestDTO } from "./DTOs";

export class GithubIntegration {
  owner: string;
  url: string;

  constructor({ owner }: { owner: string }) {
    this.owner = owner;
    this.url = "https://api.github.com";
  }

  checkUser(user: string) {
    return axios.get(`${this.url}/users/${user}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    });
  }

  checkPullRequest(repository: string, pullNumber: number) {
    return axios.get(
      `${this.url}/repos/${this.owner}/${repository}/pulls/${pullNumber}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }
    );
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

  createPullRequestToMain(repository: string) {
    return axios.post<PullRequestDTO>(
      `${this.url}/repos/${this.owner}/${repository}/pulls`,
      {
        head: "development",
        base: "main",
        title: `Release ${new Date().toISOString()}`,
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }
    );
  }

  mergePullRequest(repository: string, prNumber: number) {
    return axios.put<PullRequestDTO>(
      `${this.url}/repos/${this.owner}/${repository}/pulls/${prNumber}/merge`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }
    );
  }

  createRelease(respository: string, tag_name: string) {
    return axios.post(
      `${this.url}/repos/${this.owner}/${respository}/releases
    `,
      { tag_name },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }
    );
  }
}
