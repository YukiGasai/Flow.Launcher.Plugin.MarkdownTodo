import fs from 'node:fs';
import type { TmpSettings } from '../types.js';

const SETTINGS_PATH = 'settings.json';
const defaultSettings: TmpSettings = {
  dateOffset: 0,
  defaultLang: ''
};

export function saveSettings (settings: TmpSettings): void {
  if (fs.existsSync(SETTINGS_PATH)) {
    const settingsString = fs.readFileSync(SETTINGS_PATH, 'utf8');
    const currentSettings = JSON.parse(settingsString);
    settings = { ...currentSettings, ...settings };
  }
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings), 'utf8');
}

export function getSettings (): TmpSettings {
  if (fs.existsSync(SETTINGS_PATH)) {
    const settingsString = fs.readFileSync(SETTINGS_PATH, 'utf8');
    return JSON.parse(settingsString);
  }
  return defaultSettings;
}
