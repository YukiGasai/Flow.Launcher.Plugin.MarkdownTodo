import { Methods } from './types.js';
import { handleQuery } from './actions/handleQuery.js';
import { handleUpdateTodo } from './actions/handleUpdateTodo.js';
import { handleAddTodo } from './actions/handleAddTodo.js';
import { handleDeleteTodo } from './actions/handleDeleteTodo.js';
import { handleChangeDateOffset } from './actions/handleChangeDateOffset.js';
import { handleContextMenu } from './actions/handleContextMenu.js';

let { method, parameters, settings } = JSON.parse(process.argv[2] || '{}');

if (!parameters) {
  parameters = [];
}
if (!settings) {
  settings = {};
}

switch (method) {
  case Methods.QUERY: {
    handleQuery(settings, parameters);
    break;
  }
  case Methods.ADD_TODO: {
    handleAddTodo(parameters);
    break;
  }
  case Methods.UPDATE_TODO: {
    handleUpdateTodo(parameters);
    break;
  }
  case Methods.DELETE_TODO: {
    handleDeleteTodo(parameters);
    break;
  }

  case Methods.CHANGE_DATE_OFFSET: {
    handleChangeDateOffset(parameters);
    break;
  }

  case Methods.CONTEXT_MENU: {
    handleContextMenu(parameters);
    break;
  }

  default: {
    break;
  }
}
