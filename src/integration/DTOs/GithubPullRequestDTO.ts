export interface PullRequestDTO {
  title: string;
  url: string;
  user: {
    login: string;
  };
}
