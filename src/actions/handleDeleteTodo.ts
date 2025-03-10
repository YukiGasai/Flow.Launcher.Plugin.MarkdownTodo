import { Todo } from '../types.js';
import { showResult } from '../util/showResult.js';
import { delteTodo } from '../util/todoHelper.js';

export function handleDeleteTodo (params: string[]): void {
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
