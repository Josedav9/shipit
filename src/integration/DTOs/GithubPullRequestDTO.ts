export interface PullRequestDTO {
  title: string;
  url: string;
  html_url: string;
  number: number;
  merged_at: string; //Flag to check if PR was merge or just closed
  user: {
    login: string;
  };
  repository: {
    name: string;
  };
  head?: {
    ref: string;
  };
  base?: {
    ref: string;
  };
}

export interface PullRequestModel {
  _id: string,
  title: string;
  author: string;
  url: string;
  date: Date;
  validated: boolean;
  repository: string;
  number: number;
  prod: boolean;
}
