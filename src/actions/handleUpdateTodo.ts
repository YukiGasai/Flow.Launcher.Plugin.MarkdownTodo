import type { Flow } from 'flow-launcher-helper';
import { updateTodo } from '../util/todoHelper.js';
import { Todo, type Methods } from '../types.js';

export function handleUpdateTodo (flow: Flow<Methods>, params: string[]): void {
  const { showResult } = flow;
  const { query, item } = JSON.parse(params.join(''));

  const todo = new Todo(item.title, item.state, item.folderPath, item.fileName);

  const updateResult = updateTodo(todo);
  if (updateResult.error) {
    return showResult({
      title: 'Error updating todo',
      subtitle: updateResult.error.message,
      iconPath: 'icons\\alert.png',
    });
  }

  // Trigger a reload of the todos list by updating the query
  console.log(JSON.stringify({
    method: 'Flow.Launcher.ChangeQuery',
    parameters: [`t ${query}`, true]
  }));
}
