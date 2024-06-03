import { App, Editor, Menu, Plugin, PluginManifest, addIcon } from "obsidian";
import { DEFAULT_SETTINGS, FontrSettings } from "./types";
import { FontrSettingTab } from "./settings";
import { fontIcons } from "./icons";
import contextMenu from "./contextMenu";

export default class FontrPlugin extends Plugin {
  app: App;
  editor: Editor;
  manifest: PluginManifest;
  settings: FontrSettings;

  async loadSettings() {
    const data = await this.loadData();
    this.settings = data || Object.assign({}, DEFAULT_SETTINGS);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async loadIcons() {
    addIcon("sans-serif", fontIcons.sans);
    addIcon("serif", fontIcons.serif);
    addIcon("monospace", fontIcons.monospace);
    addIcon("script", fontIcons.script);
    addIcon("display", fontIcons.display);
  }

  async onload() {
    console.log("loading Fontr");
    await this.loadSettings();
    await this.loadIcons();

    this.addSettingTab(new FontrSettingTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on("editor-menu", this.handleFontrContextMenu)
    );

    /* this.generateTags(this.editor); */
  }

  handleFontrContextMenu = (menu: Menu, editor: Editor) => {
    contextMenu(menu, editor, this, this.settings);
  };

  applyTag(editor: Editor, fontName: string) {
    const selectedText = editor.getSelection();
    editor.replaceSelection(
      `<span style='font-family: "${fontName}"'>${selectedText}</span>`
    );
    editor.focus();
  }

  removeTags(editor: Editor) {
    const selectedText = editor.getSelection();
    editor.replaceSelection(
      selectedText.replace(/<span.*'>/, "").replace(/<\/span>/, "")
    );
    editor.focus();
  }

  /* generateTags(editor: Editor) {
    this.settings.fonts.forEach((font) => {
      this.addCommand({
        id: font.name,
        name: font.name,
        // icon: fontIcons[font.style],
        editorCallback: (editor: Editor) => {
          this.applyTag(editor, font.name);
        },
      });
    });

    this.addCommand({
      id: "unfontr",
      name: "Remove font",
      editorCallback: (editor: Editor) => {
        this.removeTags(editor);
      },
    });
  } */
}
