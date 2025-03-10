import { insertTodo } from '../util/todoHelper.js';
import { Todo } from '../types.js';
import { showResult } from '../util/showResult.js';

export function handleAddTodo (params: string[]): void {
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
