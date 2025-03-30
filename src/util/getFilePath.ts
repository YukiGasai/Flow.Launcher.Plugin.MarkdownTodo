import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { format } from 'date-fns/format';
import type { Result } from '../types.js';
import { getDateOffset } from './dateOffsetHelper.js';
import { I18n } from './i18n.js';

const i18n = I18n.getInstance();

/**
 * Get the date in the form of a pattern string
 * @param today the date to use
 * @param pattern the pattern string to convert the date to
 * @returns The upadted date as formatted string
 */
function replacePattern (today: Date, pattern: string): string {
  const trueDatePattern = pattern.slice(2, -2);
  return format(today, trueDatePattern, {
    useAdditionalDayOfYearTokens: true,
    useAdditionalWeekYearTokens: true,
  });
}

/**
 * Check for patterns in a string and replace them with the current date
 * @param input the string to check for patterns
 * @param dateOffset the offset to add to the date
 * @returns The string with the patterns replaced
 */
function checkForPatterns (input: string, dateOffset = 0): Result<string> {
  let stringWithData;
  const today = new Date();
  today.setDate(today.getDate() + dateOffset);

  try {
    stringWithData = input.replace(/\{\{[^}]*\}\}/g, (match) => {
      const newString = replacePattern(today, match);
      if (newString === 'error') {
        throw new Error(`${i18n.t('Invalid Pattern')}: ${match}`);
      }
      return newString;
    });
  } catch (error) {
    let message;
    if (error instanceof Error) message = `${i18n.t('Invalid Pattern')}: ${error.message}`;
    return { data: null, error: new Error(message) };
  }

  return { data: stringWithData, error: null };
}

/**
 * Get the folder path and file name from the settings but also check for patterns
 * @param settings the settings object
 * @returns The folder path and file name as a tuple
 */
export function getFilePath (settings: Record<string, string>): Result<[string, string?]> {
  // Make sure the folder path is set in the settings
  if (!settings.folderPath) {
    return { data: null, error: new Error(i18n.t('Missing setting Folder Path')) };
  }

  let folderPath = settings.folderPath;
  let fileName = settings.fileName;

  // Fix the folder path
  if (folderPath.endsWith('/')) {
    folderPath = folderPath.slice(0, -1);
  }

  // Fix the file name
  if (fileName?.startsWith('/')) {
    fileName = fileName.slice(1);
  }

  const dateOffset = getDateOffset();

  // Check for date patterns in folderpath
  const folderPathResult = checkForPatterns(folderPath, dateOffset);
  if (folderPathResult.error) {
    return { data: null, error: folderPathResult.error };
  }
  folderPath = folderPathResult.data;

  // If there is a filename check for data patterns
  if (fileName) {
    const fileNameResult = checkForPatterns(fileName, dateOffset);
    if (fileNameResult.error) {
      return { data: null, error: fileNameResult.error };
    }
    fileName = fileNameResult.data;
  }

  if (!existsSync(join(folderPath, fileName ?? ''))) {
    return { data: null, error: new Error(`${i18n.t('File doesn\'t exist')} ${join(folderPath, fileName ?? '')}`) };
  }

  return { data: [folderPath, fileName], error: null };
}
