import {
  App,
  DropdownComponent,
  Notice,
  PluginSettingTab,
  Setting,
  TextComponent,
} from "obsidian";
import FontrPlugin from "src/main";
import { FONTR_STYLE } from "./types";
import Sortable from "sortablejs";

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
            accept: ".ttf, .otf, .woff, .woff2, .eot",
            mutliple: false,
            style: "display: none;",
          },
        });

        input.onchange = async () => {
          const { files } = input;
          if (!files.length) return;
          console.log(files[0]);
          try {
          } catch (err) {
            new Notice("Error while importing font file");
            console.error(err);
          }

          input.value = null;
        };

        button.setButtonText("Import font").buttonEl.appendChild(input);
        button.onClick(() => input.click());
      });

    const localImport = new Setting(containerEl)
      .setName("Local import")
      .setDesc(
        "Import an already installed font by providing its name, you can optionally select a font style for aesthetic purpose (a different logo will be shown in the list).",
      );

    const fontName = new TextComponent(localImport.controlEl).setPlaceholder(
      "Font name",
    );

    const options: Record<string, string> = {};
    FONTR_STYLE.map((style) => (options[style] = style.toLowerCase()));
    const fontStyle = new DropdownComponent(localImport.controlEl).addOptions(
      options,
    );

    const addFont = localImport.addButton((button) => {
      button.setButtonText("Add").onClick(async () => {
        this.plugin.settings.fonts.push({
          name: fontName.getValue(),
          style: fontStyle.getValue(),
        });
        await this.plugin.saveSettings();
        this.display();
      });
    });

    const fontList = containerEl.createDiv();
    Sortable.create(fontList, {
      animation: 500,
      dragoverBubble: true,
      forceFallback: true,
      easing: "cubic-bezier(1, 0, 0, 1)",
      onSort: (command: { oldIndex: number; newIndex: number }) => {
        const arrayResult = this.plugin.settings.fonts;
        const [removed] = arrayResult.splice(command.oldIndex, 1);
        arrayResult.splice(command.newIndex, 0, removed);
        this.plugin.settings.fonts = arrayResult;
        this.plugin.saveSettings();
      },
    });

    this.plugin.settings.fonts.forEach((font) => {
      const container = fontList.createDiv();
      new Setting(container).setName(font.name);
    });
  }
}
