import { promises as fs, readFileSync, writeFileSync } from 'fs';
import { Todo, type Result } from '../types.js';
import { getFilePath } from './getFilePath.js';
import { join } from 'path';

export async function getTodos (settings: Record<string, string>): Promise<Result<Todo[]>> {
  const filePathResult = getFilePath(settings);
  if (filePathResult.error) {
    return { data: null, error: filePathResult.error };
  }
  const [folderPath, fileName] = filePathResult.data;

  // The filepath is just a single file so we just need to check it
  if (fileName) {
    const todos = await getTodosFromFile(folderPath, fileName);
    return { data: todos, error: null };
  }

  // Get all files in the folder and filter for markdown files
  const files = await fs.readdir(folderPath);
  const markdownFiles = files
    .filter(file => file.endsWith('.md'))
    .sort((b, a) => a.localeCompare(b));

  // Read all files in parallel
  const todosPromises = markdownFiles.map(file => getTodosFromFile(folderPath, file));
  const todosArrays = await Promise.all(todosPromises);
  const todos = todosArrays.flat();

  return { data: todos, error: null };
}

/**
 * Update a todo with its next logical state
 * @param todo The todo to update (not yet updated)
 */
export function updateTodo (todo: Todo): Result<boolean> {
  return actionWrapper(todo, (todo, fileContent) => {
    const nextState = getNextState(todo);
    const regex = new RegExp(`- \\[${escapeRegex(todo.state)}\\] ${escapeRegex(todo.title)}`, 'g');
    return fileContent.replace(regex, `- [${nextState}] ${todo.title}`);
  });
}

/**
 * This function will insert a new todo into the file that is set in the todo object
 * The new todo will be inserted after the last todo in the file
 * @param todo The todo to insert
 */
export function insertTodo (todo: Todo): Result<boolean> {
  return actionWrapper(todo, (todo, fileContent) => {
    const lastTodoIndex = findLastTodoIndex(fileContent);
    return insertNewTodoAt(fileContent, todo.title, lastTodoIndex);
  });
}

/**
 * This function will delete a todo from the file
 * @param todo The todo to delete
 */
export function delteTodo (todo: Todo): Result<boolean> {
  return actionWrapper(todo, (todo, fileContent) => {
    const regex = new RegExp(`- \\[${escapeRegex(todo.state)}\\] ${escapeRegex(todo.title)}\n`, 'g');
    return fileContent.replace(regex, '');
  });
}

/**
 * This wrapper will perform an action on a todo and update the file with the new content
 * @param todo The todo to update
 * @param action the action to perform with the todo before updating it in the file
 */
function actionWrapper (
  todo: Todo,
  action: (todo: Todo, fileContent: string) => string
): Result<boolean> {
  const filePath = todo.getFilePath();
  let fileContent: string;
  try {
    fileContent = readFileSync(filePath, 'utf8');
  } catch (error: any) {
    return { data: false, error };
  }

  const newContent = action(todo, fileContent);

  try {
    writeFileSync(filePath, newContent);
  } catch (error: any) {
    return { data: false, error };
  }
  return { data: true, error: null };
}

/**
 * This function will get the next loccial state for a todo
 * If the title contains a count pattern the state will count up
 * @param todo The todo to get the next state for
 * @returns The next state for the todo (single character)
 */
function getNextState (todo: Todo): string {
  // If the todo is already done, set it to undone
  if (todo.state === 'x') {
    return ' ';
  }
  // Check if todo has to count up
  const countMatch = todo.title.match(/#(\d)/);
  if (countMatch) {
    const countGoal = parseInt(countMatch[1] ?? '') || 1;
    const oldCount = parseInt(todo.state) || 0;
    const newCount = oldCount + 1;
    return newCount < countGoal ? newCount.toString() : 'x';
  }

  // Default all other states to done
  return 'x';
}

/**
 * Will escape all regex characters from the input string from here:
 * https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
 * @param intput String to escape the regex characters from
 * @returns  The input string with all regex characters escaped
 */
function escapeRegex (intput: string) : string {
  return intput.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * This function will read all todos from a file using regex to find them
 * @param folderPath The path to the folder where the file is located
 * @param fileName  The name of the file to read the todos from
 * @returns A list of todos from the file
 */
async function getTodosFromFile (folderPath: string, fileName: string): Promise<Todo[]> {
  const filePath = join(folderPath, fileName);
  let fileContent = '';
  try {
    fileContent = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    return [];
  }

  const regex = /- \[(.)\] (.+)/g;
  const todos: Todo[] = [];

  for (const match of fileContent.matchAll(regex)) {
    const status = match[1] ?? '';
    const text = match[2] ?? '';
    if (text) {
      todos.push(new Todo(text, status, folderPath, fileName));
    }
  }

  return todos;
}

function findLastTodoIndex (fileContent: string): number {
  const regex = /- \[.\] .*/g;
  let match;
  let lastMatchIndex = -1;

  while ((match = regex.exec(fileContent)) !== null) {
    lastMatchIndex = match.index + match[0].length;
  }

  return lastMatchIndex;
}

function insertNewTodoAt (fileContent: string, title: string, index: number): string {
  if (index !== -1) {
    // Insert the new todo after the last todo
    return `${fileContent.slice(0, index)}\n- [ ] ${title}${fileContent.slice(index)}`;
  } else {
    // If no todos are found, append the new todo at the end
    return `${fileContent}\n- [ ] ${title}`;
  }
}
