import { Flow } from 'flow-launcher-helper';
import { handleQuery } from './actions/handleQuery.js';
import { handleUpdateTodo } from './actions/handleUpdateTodo.js';
import { handleAddTodo } from './actions/handleAddTodo.js';
import { handleDeleteTodo } from './actions/handleDeleteTodo.js';
import type { Methods } from './types.js';

const flow = new Flow<Methods>();
const { on, run } = flow;

on('query', async (params: string[]) => handleQuery(flow, params));
on('add_todo', async (params: string[]) => handleAddTodo(flow, params));
on('update_todo', async (params: string[]) => handleUpdateTodo(flow, params));
on('delete_todo', async (params: string[]) => handleDeleteTodo(flow, params));

run();
