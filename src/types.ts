export const FONTR_STYLE = [
  "SERIF",
  "SANS-SERIF",
  "DISPLAY",
  "SCRIPT",
  "MONOSPACE",
] as const;

export type FontrSettings = {
  toDownload: boolean;
  fonts: {
    name: string;
    style: (typeof FONTR_STYLE)[number];
    format: string;
    path: string;
  }[];
};

export const DEFAULT_SETTINGS: FontrSettings = {
  toDownload: false,
  fonts: [],
};
