import { readFileSync } from 'node:fs';
import { type JSONRPCResponse, type FlowResult, Icon, Methods } from '../types.js';

function createResultObject (
  result: JSONRPCResponse
): FlowResult {
  return {
    Title: result.title,
    Subtitle: result.subtitle,
    ContextData: result.contextData,
    JsonRPCAction: {
      method: result.method,
      parameters: result.params || [],
      dontHideAfterAction: result.dontHideAfterAction || false,
    },
    IcoPath: result.iconPath || Icon.ALERT,
    score: result.score || 0,
  };
}

export function showResult (...resultsArray: JSONRPCResponse[]) {
  const result = resultsArray.map(createResultObject);
  console.log(JSON.stringify({ result }));
}

export function refreshResults (query: string) {
  const actionKeyword = getActionKeyword();
  console.log(JSON.stringify({
    method: Methods.CHANGE_QUERY,
    parameters: [`${actionKeyword} ${query}`, true]
  }));
}

/**
 * I use this stupid function to get the action keyword from the settings.json file each time.
 * There must be a way to get the action keyword but I couldn't find it.
 * @returns The action keyword set for the plugin
 */
function getActionKeyword (): string {
  const pathToSettings = '../../Settings/settings.json';
  try {
    const settingsString = readFileSync(pathToSettings, 'utf8');
    const settings = JSON.parse(settingsString);
    return settings.PluginSettings?.Plugins?.['dbe2ddb788c046599a627db1c3ab99af']?.ActionKeywords[0] ?? '';
  } catch (error) {
    return '';
  }
}
