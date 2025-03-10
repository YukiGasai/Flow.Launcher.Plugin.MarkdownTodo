import type { Flow, JSONRPCResponse } from 'flow-launcher-helper';
import { getFilePath } from '../util/getFilePath.js';
import { Todo, type Methods } from '../types.js';
import { getTodos } from '../util/todoHelper.js';
import { iconMap } from '../util/iconMap.js';

/**
 * Handle the query method for the plugin
 * @param flow The flow object
 * @param params The query parameters in this case the text from the search bar
 */
export async function handleQuery (flow: Flow<Methods>, params: string[]) {
  const query = params.join('').trim();

  // Add a new todo mode
  if (query.startsWith('+')) {
    return handleAddTodo(flow, query.slice(1));
  }

  // Delete a todo mode
  if (query.startsWith('-')) {
    return await handleUpdateTodo(flow, query.slice(1), true);
  }

  // Update a todo mode
  return await handleUpdateTodo(flow, query);
}

/**
 * This function handles the add todo mode to create a new todo in the file
 * @param flow The flow object
 * @param query The query string in this case the name of the new todo
 */
function handleAddTodo (flow: Flow<Methods>, query: string): void {
  const { showResult, settings } = flow;
  // Check that there is a file name so we know where to insert the todo
  if (settings['fileName'] === undefined) {
    return showResult({
      title: 'Error',
      subtitle: 'Add Todos only works when setting a file name in the settings',
      iconPath: 'icons\\alert.png',
    });
  }

  // Get the file path and make sure to resolve the date placeholder
  const folderPathResult = getFilePath(settings);
  if (folderPathResult.error) {
    return showResult({
      title: 'Error',
      subtitle: folderPathResult.error.message,
      iconPath: 'icons\\alert.png',
    });
  }
  const [folderPath, fileName] = folderPathResult.data;

  // Create a new todo object
  const newTodo = new Todo(query, ' ', folderPath, fileName!);

  // Trigger the add_todo method
  return showResult({
    title: 'Add New Todo',
    subtitle: newTodo.title,
    iconPath: 'icons\\add.png',
    method: 'add_todo',
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
async function handleUpdateTodo (flow: Flow<Methods>, query: string, isDelete = false) {
  const { showResult, settings } = flow;

  // Try to get all the todos
  const todoResult = await getTodos(settings);
  if (todoResult.error) {
    return showResult({
      title: 'Error Loading Todos',
      subtitle: todoResult.error.message,
      iconPath: 'icons\\alert.png',
    });
  }

  // Filter the todos and convert them to list items
  const todos = todoResult.data;
  const filteredTodos = filterTodos(todos, query);
  const result: JSONRPCResponse<Methods>[] = filteredTodos.map(todo => ({
    title: todo.title,
    subtitle: todo.fileName,
    iconPath: isDelete ? 'icons\\trash.png' : iconMap.get(todo.state) || 'icons\\info.png',
    method: isDelete ? 'delete_todo' : 'update_todo',
    dontHideAfterAction: true,
    params: [JSON.stringify({
      query,
      item: todo
    })]
  }));

  return showResult(...result);
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
  const terms = query.split(/\s+/); // Split by whitespace

  // Parse each term
  for (const term of terms) {
    if (term.includes(':')) {
      const [key, value] = term.split(':', 2); // Split into key and value
      if (!key || !value) {
        continue;
      }
      filters.push({ key: key.trim().toLowerCase(), value: value.trim().toLowerCase() });
    } else {
      // Default to title filter if no key is specified
      filters.push({ key: 'title', value: term.trim().toLowerCase() });
    }
  }

  // Apply filters
  return todos.filter(todo => {
    return filters.every(({ key, value }) => {
      switch (key) {
        case 'title':
          return todo.title.toLowerCase().includes(value);
        case 'state':
          if (value === 'o') {
            return todo.state.toLowerCase() === ' ';
          }
          return todo.state.toLowerCase() === value;
        case 'file':
          return todo.fileName.toLowerCase().includes(value);
        case 'folder':
          return todo.folderPath.toLowerCase().includes(value);
        default:
          // Ignore unknown keys (or handle them as needed)
          return true;
      }
    });
  });
}
