import { getFilePath } from '../util/getFilePath.js';
import { Icon, Methods, QueryOperations, QuerySpecialActions, Todo, type JSONRPCResponse } from '../types.js';
import { getTodos } from '../util/todoHelper.js';
import { iconMap } from '../util/iconMap.js';
import { showResult } from '../util/showResult.js';
import { currentDayAfterOffset } from '../util/dateOffsetHelper.js';
import { I18n } from '../util/i18n.js';

const i18n = I18n.getInstance();

/**
 * Handle the query method for the plugin
 * @param flow The flow object
 * @param params The query parameters in this case the text from the search bar
 */
export async function handleQuery (settings: Record<string, string>, params: string[]): Promise<void> {
  const query = params.join('').trim();

  // Allow the user to change the current date offset
  if (query.startsWith(QueryOperations.DATEOFFSET_MINUS)) {
    handleUpdateDateOffset(settings, true, query.slice(1));
    return;
  }

  if (query.startsWith(QueryOperations.DATEOFFSET_PLUS)) {
    handleUpdateDateOffset(settings, false, query.slice(1));
    return;
  }

  // Add a new todo mode
  if (query.startsWith(QueryOperations.ADD_TODO)) {
    return handleAddTodo(settings, query.slice(1));
  }

  // Delete a todo mode
  if (query.startsWith(QueryOperations.DELETE_TODO)) {
    await handleUpdateTodo(settings, query.slice(1), true);
    return;
  }

  // Update a todo mode
  await handleUpdateTodo(settings, query);
}

async function handleUpdateDateOffset (settings: Record<string, string>, isSubtraction: boolean, query: string) {
  const dateBeforeUpdate = currentDayAfterOffset();

  const offsetChangeString = query.trim();
  let offsetChange = parseInt(offsetChangeString || '1', 10);

  if (isNaN(offsetChange)) {
    offsetChange = 1;
  }
  const newOffset = isSubtraction ? -offsetChange : offsetChange;
  const newDate = getDateWithOffset(dateBeforeUpdate, newOffset);
  let title = `--- ${formatDate(dateBeforeUpdate)} ---`;
  if (isToday(dateBeforeUpdate)) {
    title = `--- ${i18n.t('Today')} ---`;
  }
  const result = {
    title,
    subtitle: `${isSubtraction ? i18n.t('Subtract') : i18n.t('Add')} ${offsetChange} ${i18n.t('day(s) to')} ${newDate}`,
    iconPath: isSubtraction ? Icon.LEFT : Icon.RIGHT,
    method: Methods.CHANGE_DATE_OFFSET,
    // Dumb way to make sure the order of the results is always the same as in the markdown file
    score: 1000000,
    dontHideAfterAction: true,
    params: [JSON.stringify({
      offsetChangeAmount: newOffset
    })],
  };
  const todos:any = await handleUpdateTodo(settings, query, false, true);
  return showResult(result, ...todos);
}

function getDateWithOffset (currentDate: Date, offset: number): string {
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + offset);
  return formatDate(newDate);
}

function formatDate (date: Date): string {
  return date.toISOString().split('T')[0] ?? ''; // Format as YYYY-MM-DD
}

function isToday (date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * This function handles the add todo mode to create a new todo in the file
 * @param flow The flow object
 * @param query The query string in this case the name of the new todo
 */
function handleAddTodo (settings: Record<string, string>, query: string): void {
  // Check that there is a file name so we know where to insert the todo
  if (settings['fileName'] === undefined) {
    return showResult({
      title: i18n.t('Error'),
      subtitle: i18n.t('Add Todos only works when setting a file name in the settings'),
      method: Methods.OPEN_SETTINGS,
      iconPath: Icon.ALERT,
    });
  }

  // Get the file path and make sure to resolve the date placeholder
  const folderPathResult = getFilePath(settings);
  if (folderPathResult.error) {
    return showResult({
      title: i18n.t('Error'),
      subtitle: folderPathResult.error.message,
      method: Methods.OPEN_SETTINGS,
      iconPath: Icon.ALERT,
    });
  }
  const [folderPath, fileName] = folderPathResult.data;

  // Create a new todo object
  const newTodo = new Todo(query, ' ', folderPath, fileName!);

  // Trigger the add_todo method
  return showResult({
    title: i18n.t('Add New Todo'),
    subtitle: newTodo.title,
    iconPath: Icon.ADD,
    method: Methods.ADD_TODO,
    dontHideAfterAction: true,
    params: [JSON.stringify({
      todo: newTodo
    })]
  });
}

/**
 * This function will list all the todos that match the search query and allow the user to update them when selecting an item
 * @param flow The flow object
 * @param query The query string in this case the search query
 * @param isDelete  Whether the update is a delete operation
 */
async function handleUpdateTodo (settings: Record<string, string>, query: string, isDelete = false, noDisplay = false): Promise<JSONRPCResponse[]> {
  // Try to get all the todos
  const todoResult = await getTodos(settings);
  if (todoResult.error) {
    if (!noDisplay) {
      showResult({
        title: i18n.t('Error loading Todos'),
        subtitle: todoResult.error.message,
        method: Methods.OPEN_SETTINGS,
        iconPath: Icon.ALERT,
      });
    }
    return [];
  }

  // Filter the todos and convert them to list items
  const todos = todoResult.data;
  const filteredTodos = filterTodos(todos, query);
  const result: JSONRPCResponse[] = filteredTodos.map((todo, index) => ({
    title: todo.title,
    subtitle: todo.fileName,
    iconPath: isDelete ? Icon.TRASH : iconMap.get(todo.state) || Icon.INFO,
    method: isDelete ? Methods.DELETE_TODO : Methods.UPDATE_TODO,
    dontHideAfterAction: true,
    contextData: [JSON.stringify({ query, item: todo })],
    params: [JSON.stringify({ query, item: todo })],
    // Dumb way to make sure the order of the results is always the same as in the markdown file
    score: 100000 - (index * 1000),
  }));

  if (noDisplay) {
    return result;
  }

  showResult(...result);
  return [];
}

/**
 * This function will filter the todos based on the search query and allows the user to filter for specific fields
 * @param todos A list of todos to filter
 * @param query The searchbar query string to filter the todos
 * @returns A list of todos that match the query
 */
function filterTodos (todos: Todo[], query: string): Todo[] {
  const filters: { key: string; value: string }[] = [];

  // Split input into individual terms
  const terms = query.split(/\s+/);

  // Parse each term
  for (const term of terms) {
    if (term.includes(':')) {
      const [key, value] = term.split(':', 2);
      if (!key || !value) {
        continue;
      }
      filters.push({ key: key.trim().toLowerCase(), value: value.trim().toLowerCase() });
    } else {
      // Default to title filter if no key is specified
      filters.push({ key: QuerySpecialActions.SEACH_TITLE, value: term.trim().toLowerCase() });
    }
  }

  // Apply filters
  return todos.filter(todo => {
    return filters.every(({ key, value }) => {
      switch (key) {
        case QuerySpecialActions.SEACH_TITLE:
          return todo.title.toLowerCase().includes(value);
        case QuerySpecialActions.SEACH_STATE:
          if (value === 'o') {
            return todo.state.toLowerCase() === ' ';
          }
          return todo.state.toLowerCase() === value;
        case QuerySpecialActions.SEACH_FILE_NAME:
          return todo.fileName.toLowerCase().includes(value);
        case QuerySpecialActions.SEACH_FOLDER_PATH:
          return todo.folderPath.toLowerCase().includes(value);
        default:
          // Ignore unknown keys
          return true;
      }
    });
  });
}
