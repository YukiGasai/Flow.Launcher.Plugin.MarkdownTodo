import { Icon, Methods, Todo } from '../types.js';
import { I18n } from '../util/i18n.js';
import { refreshResults, showResult } from '../util/showResult.js';
import { delteTodo } from '../util/todoHelper.js';

export function handleDeleteTodo (params: string[]): void {
  const { query, item } = JSON.parse(params.join(''));

  const todo = new Todo(item.title, item.state, item.folderPath, item.fileName);
  const i18n = I18n.getInstance();

  const delteResult = delteTodo(todo);
  if (delteResult.error) {
    return showResult({
      title: i18n.t('Error deleting todo'),
      subtitle: delteResult.error.message,
      method: Methods.OPEN_SETTINGS,
      iconPath: Icon.ALERT,
    });
  }

  refreshResults(query);
}
