import fs from 'node:fs';

export function log (message: string) {
  const logFile = 'log.txt';
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, logMessage, 'utf8');
  } else {
    fs.appendFileSync(logFile, logMessage);
  }
}
