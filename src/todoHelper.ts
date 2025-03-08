import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { Todo, type Result } from './types.js';
import { getFilePath } from './getFilePath.js';
import { join } from 'path';

function getTodosFromFile (folderPath: string, fileName: string): Todo[] {
  const filePath = join(folderPath, fileName);
  const fileContent = readFileSync(filePath, 'utf8');

  const todos: Todo[] = [];

  const regex = /- \[(.)\] (.*)/g;
  let match;
  // eslint-disable-next-line no-cond-assign
  while (match = regex.exec(fileContent)) {
    if (match[1] && match[2]) {
      todos.push(new Todo(match[2], match[1], folderPath, fileName));
    }
  }
  return todos;
}

export function getTodos (settings: Record<string, string>): Result<Todo[]> {
  const filePathResult = getFilePath(settings);
  if (filePathResult.error) {
    return { data: null, error: filePathResult.error };
  }
  const [folderPath, fileName] = filePathResult.data;

  // The filepath is just a single file so we just need to check it
  if (fileName) {
    return { data: getTodosFromFile(folderPath, fileName), error: null };
  }

  // Get all files in the folder and filter for markdown files
  const files = readdirSync(folderPath);
  const markdownFiles = files
    .filter(file => file.endsWith('.md'))
    .sort((b, a) => a.localeCompare(b));

  const todos: Todo[] = [];
  markdownFiles.forEach(file => {
    todos.push(...getTodosFromFile(folderPath, file));
  });

  return { data: todos, error: null };
}

export function updateTodo (todo: Todo) {
  const fileContent = readFileSync(todo.getFilePath(), 'utf8');
  const regex = new RegExp(`- \\[.\\] ${todo.title}`, 'g');
  const newContent = fileContent.replace(regex, `- [${todo.state}] ${todo.title}`);

  writeFileSync(todo.getFilePath(), newContent);
}
