export type ScaffoldInfo = Record<string, {
  title: string;
  link: string;
  description: string;
}>;

export type MplPromptsExtra = Partial<{
  isInstall: boolean;
}>