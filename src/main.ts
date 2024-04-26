import { App, Editor, Menu, Notice, Plugin, PluginManifest } from "obsidian";
import { DEFAULT_SETTINGS, FontrSettings } from "./types";
import { FontrSettingTab } from "./settings";

export default class HighlightrPlugin extends Plugin {
  app: App;
  editor: Editor;
  manifest: PluginManifest;
  settings: FontrSettings;

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onload() {
    console.log("loading Fontr");
    await this.loadSettings();

    this.addSettingTab(new FontrSettingTab(this.app, this));
  }
}
