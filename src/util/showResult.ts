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
  console.log(JSON.stringify({
    method: Methods.CHANGE_QUERY,
    parameters: [`t ${query}`, true]
  }));
}
