import { App, Editor, Menu, Notice, Plugin, PluginManifest } from "obsidian";
import { DEFAULT_SETTINGS, FontrSettings } from "./types";
import { FontrSettingTab } from "./settings";

export default class HighlightrPlugin extends Plugin {
  app: App;
  editor: Editor;
  manifest: PluginManifest;
  settings: FontrSettings;

  async loadSettings() {
    const data = await this.loadData();
    this.settings = data || Object.assign({}, DEFAULT_SETTINGS);
  }

  async saveSettings() {
    console.log(this.settings.fonts);
    await this.saveData(this.settings);
  }

  async onload() {
    console.log("loading Fontr");
    await this.loadSettings();

    this.addSettingTab(new FontrSettingTab(this.app, this));
  }
}
