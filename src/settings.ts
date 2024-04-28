import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import FontrPlugin from "src/main";
import { FONTR_STYLE } from "./types";
import { appendFile } from "fs";
import { readdir } from "fs/promises";
import { platform } from "os";

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
      dirs.map((dir) => readdir(dir, { withFileTypes: false })),
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

    new Setting(containerEl)
      .addDropdown((drop) => {
        drop.addOptions(
          FONTR_STYLE.reduce<Record<string, string>>(
            (acc, font) =>
              (acc = {
                ...acc,
                [font]: font.toLowerCase(),
              }),
            {},
          ),
        );
      })
      .addSearch((search) => {
        search.inputEl.setAttr("list", "fontsdata");
        search.setPlaceholder("Search font name...").onChange((newName) => {
          if (
            newName &&
            this.plugin.settings.fonts.find(
              ({ name }) => name.toLowerCase() === newName.toLowerCase(),
            )
          ) {
            new Notice("Font with the same name already added");
            return;
          }
        });
      })
      .addExtraButton((button) => {
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

          if (
            this.plugin.settings.fonts.find(({ name }) => name === fileName)
          ) {
            new Notice("Font with the same name already added");
            return;
          }

          this.plugin.settings.fonts.push({
            name: fileName,
            style: "MONOSPACE",
            format: fileExt,
            path: file.name,
          });

          appendFile(
            "styles.css",
            `@font-face {
              font-family: "${fileName}"; 
              src: local("${file.name}");
            }`,
            (err) => {
              console.log("here");
              if (err) {
                new Notice("Error while adding style to style.css");
                return;
              }
            },
          );

          this.plugin.saveSettings();
          console.log(this.plugin.settings.fonts);
          this.display();
          try {
          } catch (err) {
            new Notice("Error while importing font file");
            console.error(err);
          }

          input.value = null;
        };

        button.setIcon("folder-search").onClick(() => input.click());
      });

    this.plugin.settings.fonts.forEach((font) => {
      const fontSetting = new Setting(containerEl)
        .setName(font.name)
        .setDesc(`${font.style} | ${font.format} | ${font.path}`)
        .setDesc("<b>Ciao</b>")
        .addExtraButton((button) => {
          button.setIcon("settings-2");
        })
        .addExtraButton((button) => {
          button.setIcon("up-chevron-glyph");
        })
        .addExtraButton((button) => {
          button.setIcon("down-chevron-glyph");
        })
        .addExtraButton((button) => {
          button.setIcon("cross");
          button.onClick(() => {
            this.plugin.settings.fonts = this.plugin.settings.fonts.filter(
              (f) => f.name !== font.name,
            );
            this.plugin.saveSettings();
            this.display();
          });
        });

      fontSetting.descEl.createDiv({});
    });
  }
}
