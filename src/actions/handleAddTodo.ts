import type { Flow } from 'flow-launcher-helper';
import { insertTodo } from '../util/todoHelper.js';
import { Todo, type Methods } from '../types.js';

export function handleAddTodo (flow: Flow<Methods>, params: string[]): void {
  const { showResult } = flow;
  const { todo } = JSON.parse(params.join(''));

  const newTodo = new Todo(todo.title, todo.state, todo.folderPath, todo.fileName);

  const insertResult = insertTodo(newTodo);
  if (insertResult.error) {
    return showResult({
      title: 'Error inserting todo',
      subtitle: insertResult.error.message,
      iconPath: 'icons\\alert.png',
    });
  }

  console.log(JSON.stringify({
    method: 'Flow.Launcher.ChangeQuery',
    parameters: [`t ${newTodo.title}`, true]
  }));
}
