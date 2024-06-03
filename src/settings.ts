import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import FontrPlugin from "src/main";
import { readdir } from "fs/promises";
import { platform } from "os";
import { fontIcons } from "./icons";
import { randomUUID } from "crypto";

export class FontrSettingTab extends PluginSettingTab {
  plugin: FontrPlugin;
  appendMethod: string;

  constructor(app: App, plugin: FontrPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getFontsInstalled() {
    let dirs: string[];
    switch (platform()) {
      case "win32":
        dirs = ["c:/windows/fonts", "../microsoft/windows/fonts"];
    }

    return Promise.all(
      dirs.map((dir) => readdir(dir, { withFileTypes: false }))
    );
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h1", { text: "Fontr" });

    containerEl.createEl("datalist", {}, (el) => {
      this.getFontsInstalled().then((fontDirs) => {
        fontDirs.forEach((fontDir) => {
          fontDir.forEach((option) => {
            el.createEl("option", {
              value: option,
            });
          });
        });
      });
      el.setAttr("id", "fontsdata");
    });

    new Setting(containerEl).addExtraButton((button) => {
      const input = containerEl.createEl("input", {
        attr: {
          type: "file",
          name: "font-import",
          accept: ".ttf, .otf, .woff, .woff2, .eot",
          mutliple: false,
          style: "display: none;",
        },
      });

      input.oninput = async () => {
        const { files } = input;
        if (!files.length) return;

        const file = files[0];
        const [fileName, fileExt] = file.name.replace(/-/g, " ").split(".");

        if (this.plugin.settings.fonts.find(({ path }) => path === file.name)) {
          new Notice("Font with the same name already added");
          return;
        }

        this.plugin.settings.fonts.push({
          id: randomUUID(),
          name: fileName,
          style: "monospace",
          format: fileExt,
          path: file.name,
        });

        this.plugin.saveSettings();
        this.display();
      };

      button.setIcon("folder-search").onClick(() => input.click());
    });

    this.plugin.settings.fonts.forEach((font) => {
      const fontContainer = containerEl.createDiv("", (div) => {
        div.addClass("font-container");
        div.createSpan("", (span) => {
          span.addClass("font-container-icon");
          span.innerHTML = fontIcons[font.style];
        });
      });

      const fontSetting = new Setting(fontContainer)
        .setName(font.name)
        .setTooltip(font.name)
        .setDesc(font.path)
        .addText((renameText) => {
          renameText.onChange((newFontName) => (font.name = newFontName));
          renameText.inputEl.addClass("input-rename");
          renameText.inputEl.toggleClass(
            "input-disabled",
            !this.plugin.settings.isRenaming
          );
        })
        .addExtraButton((rename) => {
          rename.setIcon(
            this.plugin.settings.isRenaming ? "check" : "pencil-line"
          );
          rename.onClick(() => {
            this.plugin.settings.isRenaming = !this.plugin.settings.isRenaming;
            this.plugin.saveSettings();
            this.display();
          });
        })
        .addExtraButton((remove) => {
          remove.setIcon("cross");
          remove.onClick(() => {
            this.plugin.settings.fonts = this.plugin.settings.fonts.filter(
              (f) => f.id !== font.id
            );
            this.plugin.saveSettings();
            this.display();
          });
        });

      fontSetting.nameEl.setAttr("style", `font-family: "${font.name}"`);
    });
  }
}
