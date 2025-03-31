import { updateTodo } from '../util/todoHelper.js';
import { Icon, Methods, Todo } from '../types.js';
import { refreshResults, showResult } from '../util/showResult.js';
import { I18n } from '../util/i18n.js';

const i18n = I18n.getInstance();

export function handleUpdateTodo (params: string[]): void {
  const { query, item, state } = JSON.parse(params.join(''));

  const todo = new Todo(item.title, item.state, item.folderPath, item.fileName);

  const updateResult = updateTodo(todo, state);
  if (updateResult.error) {
    return showResult({
      title: i18n.t('Error updating todo'),
      subtitle: updateResult.error.message,
      method: Methods.OPEN_SETTINGS,
      iconPath: Icon.ALERT,
    });
  }

  refreshResults(query);
}
