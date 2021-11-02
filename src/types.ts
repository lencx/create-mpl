export type GithubDownloaderOptions = {
  owner: string;
  repo: string;
  ref: string;
  dir: string;
};

export type ScaffoldInfo = Record<string, {
  title: string;
  link: string;
  description: string;
}>;
