import type { Flow } from 'flow-launcher-helper';
import { Todo, type Methods } from '../types.js';
import { delteTodo } from '../util/todoHelper.js';

export function handleDeleteTodo (flow: Flow<Methods>, params: string[]): void {
  const { showResult } = flow;
  const { query, item } = JSON.parse(params.join(''));

  const todo = new Todo(item.title, item.state, item.folderPath, item.fileName);

  const delteResult = delteTodo(todo);
  if (delteResult.error) {
    return showResult({
      title: 'Error deleting todo',
      subtitle: delteResult.error.message,
      iconPath: 'icons\\alert.png',
    });
  }

  console.log(JSON.stringify({
    method: 'Flow.Launcher.ChangeQuery',
    parameters: [`t ${query}`, true]
  }));
}
