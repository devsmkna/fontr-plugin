import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import FontrPlugin from "src/main";
import { FONTR_STYLE } from "./types";

export class FontrSettingTab extends PluginSettingTab {
  plugin: FontrPlugin;
  appendMethod: string;

  constructor(app: App, plugin: FontrPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h1", { text: "Fontr" });

    new Setting(containerEl)
      .setName("Add new font")
      .setDesc("Add local fonts by providing the font name and it's style")
      .addButton((button) => {
        const input = containerEl.createEl("input", {
          attr: {
            type: "file",
            name: "font-import",
            mutliple: false,
            style: "display: none;",
          },
        });
        input.onchange = async () => {
          const { files } = input;
          if (!files.length) return;
          try {
          } catch (err) {
            new Notice("Error while importing font file");
            console.error(err);
          }
        };
      });

    new Setting(containerEl)
      .setName("Font name")
      .setDesc("Set a font name, it must be unique.")
      .addText((component) => {
        component.setPlaceholder("Font name");
      });

    new Setting(containerEl)
      .setName("Font style")
      .setDesc(
        `Set the font style picking one value between ${FONTR_STYLE.join(", ")}.`,
      )
      .addDropdown((dropdown) => {
        const options: Record<string, string> = {};
        FONTR_STYLE.map((style) => (options[style] = style.toLowerCase()));
        dropdown.addOptions(options);
      });
  }
}
