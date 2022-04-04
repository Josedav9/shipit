export interface PullRequestDTO {
  title: string;
  url: string;
  html_url: string
  user: {
    login: string;
  };
}
