import { App, Editor, Menu, Plugin } from "obsidian";
import { FontrSettings } from "./types";
import FontrPlugin from "./main";

export default function contextMenu(
  menu: Menu,
  editor: Editor,
  plugin: FontrPlugin,
  settings: FontrSettings
): void {
  const selection = editor.getSelection();

  menu.addItem((item) => {
    item
      .setTitle("Fontr")
      .setIcon("sans")
      .onClick((event: MouseEvent) =>
        fontMenu(plugin, settings, editor, event)
      );
  });

  if (selection) {
    menu.addItem((item) =>
      item
        .setTitle("Remove Fontr")
        .onClick(() => editor.getSelection() && plugin.removeTags(editor))
    );
  }
}

const fontMenu = (
  plugin: FontrPlugin,
  settings: FontrSettings,
  editor: Editor,
  event: MouseEvent
): void => {
  if (editor && editor.hasFocus()) {
    const menu = new Menu();
    settings.fonts.forEach((font) =>
      menu.addItem((fontItem) => {
        fontItem.setTitle(font.name);
        fontItem.onClick(() => plugin.applyTag(editor, font.name));
      })
    );

    menu.showAtMouseEvent(event);
  }
};
