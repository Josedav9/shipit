export interface PullRequestDTO {
  title: string;
  url: string;
  html_url: string;
  number: number;
  user: {
    login: string;
  };
  repo: {
    name: string;
  };
}
