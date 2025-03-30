import fs from 'node:fs';
import { execSync } from 'child_process';
import { getSettings, saveSettings } from './tmpSettingsHelper.js';

export class I18n {
  static #instance: I18n | null = null;

  private translations: Record<string, Record<string, string>> = {};
  private defaultLang: string = 'en_US';

  private constructor () {
    // get locals folder
    const localesPath = './locales';
    const files = fs.readdirSync(localesPath);

    // get all files in locales folder
    files.forEach((file) => {
      if (!file.endsWith('.json')) {
        return;
      }
      // Get the translations from the file
      const langKey = file.replace('.json', '');
      const filePath = `${localesPath}/${file}`;
      const translationList = fs.readFileSync(filePath, 'utf8');
      this.translations[langKey] = JSON.parse(translationList);
    });

    this.defaultLang = this.getDefaultLang();
  }

  static getInstance (): I18n {
    if (!I18n.#instance) {
      I18n.#instance = new I18n();
    }
    return I18n.#instance;
  }

  private getDefaultLang (): string {
    // Check if there already is a default lang set in the settings
    const settings = getSettings();
    if (settings.defaultLang) {
      return settings.defaultLang;
    }

    const env = process.env;
    let lang = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
    if (lang) {
      lang = lang.replace(/-/g, '_');
      settings.defaultLang = lang;
      saveSettings(settings);
      return lang;
    }

    if (process.platform !== 'win32') {
      return 'en_US';
    }

    return this.getUICulture();
  }

  private getUICulture (): string {
    try {
      // Get the default lang from the system
      const result = execSync('powershell -Command "(Get-UICulture).Name"', { encoding: 'utf8' });
      const lang = result.trim().replace(/-/g, '_');
      const settings = getSettings();
      settings.defaultLang = lang;
      saveSettings(settings);

      return lang;
    } catch (error) {
      return 'en_US';
    }
  }

  translate (key: string, langKey: string): string {
    // No translations available, return the key should be just english
    if (Object.keys(this.translations).length === 0) {
      return key;
    }

    const translation = this.translations[langKey] || this.translations.en_US;
    return translation?.[key] || key;
  }

  t (key: string): string {
    return this.translate(key, this.defaultLang);
  }
}
