import { insertTodo } from '../util/todoHelper.js';
import { Icon, Todo } from '../types.js';
import { refreshResults, showResult } from '../util/showResult.js';
import { I18n } from '../util/i18n.js';

export function handleAddTodo (params: string[]): void {
  const { todo } = JSON.parse(params.join(''));

  const newTodo = new Todo(todo.title, todo.state, todo.folderPath, todo.fileName);
  const i18n = I18n.getInstance();
  const insertResult = insertTodo(newTodo);
  if (insertResult.error) {
    return showResult({
      title: i18n.t('Error inserting todo'),
      subtitle: insertResult.error.message,
      iconPath: Icon.ALERT,
    });
  }

  refreshResults(newTodo.title);
}
