import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { format } from 'date-fns/format';
import type { Result } from './types.js';

function replacePattern (today: Date, pattern: string): string {
  const trueDatePattern = pattern.slice(2, -2);
  return format(today, trueDatePattern, {
    useAdditionalDayOfYearTokens: true,
    useAdditionalWeekYearTokens: true,
  });
}

function checkForPatterns (input: string, dateOffset = 0): Result<string> {
  let stringWithData;
  const today = new Date();
  today.setDate(today.getDate() + dateOffset);

  try {
    stringWithData = input.replace(/\{\{[^}]*\}\}/g, (match) => {
      const newString = replacePattern(today, match);
      if (newString === 'error') {
        throw new Error(`Invalid Pattern: ${match}`);
      }
      return newString;
    });
  } catch (error) {
    let message;
    if (error instanceof Error) message = `Invalid Pattern: ${error.message}`;
    return { data: null, error: new Error(message) };
  }

  return { data: stringWithData, error: null };
}

export function getFiles (settings: Record<string, string>): Result<string[]> {
  const folderPathResult = getFilePath(settings);
  if (folderPathResult.error) {
    return { data: null, error: folderPathResult.error };
  }

  const [folderPath, fileName] = folderPathResult.data;

  if (fileName) {
    return { data: [fileName], error: null };
  }

  const files = readdirSync(folderPath);
  const markdownFiles = files
    .filter(file => file.endsWith('.md'))
    .sort((b, a) => a.localeCompare(b));

  return { data: markdownFiles, error: null };
}

export function getFilePath (settings: Record<string, string>): Result<[string, string?]> {
  // Make sure the folder path is set in the settings
  if (!settings.folderPath) {
    return { data: null, error: new Error('Missing setting Folder Path') };
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

  // Check for date patterns in folderpath
  const folderPathResult = checkForPatterns(folderPath);
  if (folderPathResult.error) {
    return { data: null, error: folderPathResult.error };
  }
  folderPath = folderPathResult.data;

  // If there is a filename check for data patterns
  if (fileName) {
    const fileNameResult = checkForPatterns(fileName);
    if (fileNameResult.error) {
      return { data: null, error: fileNameResult.error };
    }
    fileName = fileNameResult.data;
  }

  if (!existsSync(join(folderPath, fileName ?? ''))) {
    return { data: null, error: new Error(`File doesn't exist ${join(folderPath, fileName ?? '')}`) };
  }

  return { data: [folderPath, fileName], error: null };
}
