import { App, Editor, Menu, Notice, Plugin, PluginManifest } from "obsidian";
import { DEFAULT_SETTINGS, FontrSettings } from "./settings/types";
import { FontrSettingTab } from "./settings/fontrSettingTab";

export default class HighlightrPlugin extends Plugin {
  app: App;
  editor: Editor;
  manifest: PluginManifest;
  settings: FontrSettings;

  async onload() {
    console.log("loaded");
    this.addSettingTab(new FontrSettingTab(this.app, this));
  }
}
