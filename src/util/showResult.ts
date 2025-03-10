import type { JSONRPCResponse, FlowResult } from '../types.js';

function createResultObject (
  result: JSONRPCResponse
): FlowResult {
  return {
    Title: result.title,
    Subtitle: result.subtitle,
    JsonRPCAction: {
      method: result.method,
      parameters: result.params || [],
      dontHideAfterAction: result.dontHideAfterAction || false,
    },
    IcoPath: result.iconPath || 'icons\\bookmark.png',
    score: result.score || 0,
  };
}

export function showResult (...resultsArray: JSONRPCResponse[]) {
  const result = resultsArray.map(createResultObject);
  console.log(JSON.stringify({ result }));
}
