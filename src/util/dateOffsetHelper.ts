import { getSettings, saveSettings } from './tmpSettingsHelper.js';

export function getDateOffset (): number {
  return getSettings().dateOffset;
}

export function changeDateOffsetByAmount (amount: number): void {
  const settings = getSettings();
  settings.dateOffset += amount;
  saveSettings(settings);
}

export function currentDayAfterOffset (): Date {
  const dateOffset = getDateOffset();
  const today = new Date();
  today.setDate(today.getDate() + dateOffset);
  return today;
}
