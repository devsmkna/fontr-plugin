export const FONTR_STYLE = [
  "SERIF",
  "SANS-SERIF",
  "DISPLAY",
  "SCRIPT",
  "MONOSPACE",
];

export type FontrSettings = {
  fonts: {
    name: string;
    style: (typeof FONTR_STYLE)[number];
  }[];
};

export const DEFAULT_SETTINGS: FontrSettings = {
  fonts: [
    {
      name: "Noto Sans",
      style: "SANS-SERIF",
    },
    {
      name: "Times New Roman",
      style: "SERIF",
    },
  ],
};
