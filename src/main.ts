import { handleQuery } from './actions/handleQuery.js';
import { handleUpdateTodo } from './actions/handleUpdateTodo.js';
import { handleAddTodo } from './actions/handleAddTodo.js';
import { handleDeleteTodo } from './actions/handleDeleteTodo.js';

let { method, parameters, settings } = JSON.parse(process.argv[2] || '{}');

if (!parameters) {
  parameters = [];
}
if (!settings) {
  settings = {};
}

switch (method) {
  case 'query': {
    handleQuery(settings, parameters);
    break;
  }
  case 'add_todo': {
    handleAddTodo(parameters);
    break;
  }
  case 'update_todo': {
    handleUpdateTodo(parameters);
    break;
  }
  case 'delete_todo': {
    handleDeleteTodo(parameters);
    break;
  }
  default: {
    break;
  }
}
