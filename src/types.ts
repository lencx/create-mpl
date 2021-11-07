export type GithubDownloaderOptions = {
  owner: string;
  repo: string;
  dir: string;
  ref: string;
  overwrite?: Function;
};

export type ScaffoldInfo = Record<string, {
  title: string;
  link: string;
  description: string;
}>;
