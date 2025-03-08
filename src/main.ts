import { Flow, type JSONRPCResponse } from 'flow-launcher-helper';
import { Todo, type Methods } from './types.js';
import { getTodos, updateTodo } from './todoHelper.js';
import { iconMap } from './iconMap.js';

const { showResult, on, run, settings } = new Flow<Methods>();

on('query', async (params) => {
  const query = params.join('').trim();

  const todoResult = getTodos(settings);
  if (todoResult.error) {
    return showResult({
      title: 'Error Loading Todos',
      subtitle: todoResult.error.message,
      iconPath: 'icons\\alert.png',
    });
  }
  const todos = todoResult.data;

  const filteredTodos = filterTodos(todos, query);

  const result: JSONRPCResponse<Methods>[] = filteredTodos.map(todo => ({
    title: todo.title,
    subtitle: todo.fileName,
    iconPath: iconMap.get(todo.state) || 'icons\\info.png',
    method: 'update_todo',
    dontHideAfterAction: true,
    params: [JSON.stringify({
      query: params,
      item: todo
    })]
  }));

  return showResult(...result);
});

on('update_todo', async (params) => {
  const { query, item } = JSON.parse(params.join(''));

  const todo = new Todo(item.title, item.state, item.folderPath, item.fileName);

  const countPattern = /#(\d)/;

  if (todo.state === 'x') {
    todo.state = ' ';
  } else {
    const countMatch = item.title.match(countPattern);
    if (countMatch) {
      const countGoal = parseInt(countMatch[1]) || 1;
      const oldCount = parseInt(todo.state) || 0;
      const newCount = oldCount + 1;
      if (newCount < countGoal) {
        todo.state = newCount.toString();
      } else {
        todo.state = 'x';
      }
    } else {
      todo.state = todo.isDone() ? ' ' : 'x';
    }
  }
  updateTodo(todo);

  console.log(JSON.stringify({
    method: 'Flow.Launcher.ChangeQuery',
    parameters: [`t ${query}`, true]
  }));
});

run();

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
