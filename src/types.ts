export const FONTR_STYLE = [
  "serif",
  "sans",
  "monospace",
  "display",
  "script",
] as const;

export type FontrSettings = {
  isRenaming: boolean;
  fonts: {
    id: string;
    name: string;
    style: (typeof FONTR_STYLE)[number];
    format: string;
    path: string;
  }[];
};

export const DEFAULT_SETTINGS: FontrSettings = {
  isRenaming: false,
  fonts: [],
};
