export type Result<T, E = Error> = | { data: T; error: null } | { data: null; error: E };

export enum State {
  ALERT = '!',
  BOOKMARK = 'b',
  CAKE = 'w',
  CHECK = 'x',
  DOLLAR = 'S',
  DOWN = 'd',
  UP = 'u',
  FLAME = 'f',
  LIGHTBULB = 'I',
  INFO = 'i',
  KEY = 'k',
  LEFT = '<',
  PIN = 'l',
  HELP = '?',
  RIGHT = '>',
  STAR = '*',
  PRO = 'p',
  CONTRA = 'c',
  UNCHECKED = ' ',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9'
}

export enum Icon {
  ALERT = 'icons\\alert.png',
  BOOKMARK = 'icons\\bookmark.png',
  CAKE = 'icons\\cake.png',
  CHECK = 'icons\\check.png',
  DOLLAR = 'icons\\dollar.png',
  DOWN = 'icons\\down.png',
  UP = 'icons\\up.png',
  FLAME = 'icons\\flame.png',
  LIGHTBULB = 'icons\\lightbulb.png',
  INFO = 'icons\\info.png',
  KEY = 'icons\\key.png',
  LEFT = 'icons\\left.png',
  PIN = 'icons\\pin.png',
  HELP = 'icons\\help.png',
  RIGHT = 'icons\\right.png',
  STAR = 'icons\\star.png',
  PRO = 'icons\\pro.png',
  CONTRA = 'icons\\contra.png',
  UNCHECKED = 'icons\\circle.png',
  ONE = 'icons\\1.png',
  TWO = 'icons\\2.png',
  THREE = 'icons\\3.png',
  FOUR = 'icons\\4.png',
  FIVE = 'icons\\5.png',
  SIX = 'icons\\6.png',
  SEVEN = 'icons\\7.png',
  EIGHT = 'icons\\8.png',
  NINE = 'icons\\9.png',
  TRASH = 'icons\\trash.png',
  ADD = 'icons\\add.png',
}

export class Todo {
  constructor (
    public title: string,
    public stateString: string,
    public folderPath: string,
    public fileName: string
  ) {
    this.title = title;
    this.stateString = stateString;
    this.folderPath = folderPath;
    this.fileName = fileName;
    this.state = this.parseState(stateString);
  }

  public state: State;

  private parseState (state: string): State {
    const validStates = Object.values(State) as string[];
    return validStates.includes(state) ? (state as State) : State.ALERT;
  }

  getFilePath (): string {
    return `${this.folderPath}/${this.fileName}`;
  }
}

export interface JSONRPCResponse {
  title: string;
  subtitle?: string;
  method?: string;
  params?: string[];
  dontHideAfterAction?: boolean;
  iconPath?: string;
  score?: number;
  contextData?: string[];
}

export interface FlowResult {
  Title: string;
  Subtitle?: string;
  ContextData?: string[];
  JsonRPCAction: {
    method?: string;
    parameters: string[];
    dontHideAfterAction: boolean;
  };
  IcoPath?: string;
  score: number;
}

export interface TmpSettings {
  dateOffset: number;
  defaultLang: string;
}

export enum QueryOperations {
  DATEOFFSET_MINUS = '<',
  DATEOFFSET_PLUS = '>',
  ADD_TODO = '+',
  DELETE_TODO = '-'
}

export enum QuerySpecialActions {
  SEACH_TITLE = 'title',
  SEACH_STATE = 'state',
  SEACH_FILE_NAME = 'file',
  SEACH_FOLDER_PATH = 'folder',
}

export enum Methods {
  CHANGE_QUERY = 'Flow.Launcher.ChangeQuery',
  CONTEXT_MENU = 'context_menu',
  CHANGE_DATE_OFFSET = 'change_date_offset',
  ADD_TODO = 'add_todo',
  DELETE_TODO = 'delete_todo',
  UPDATE_TODO = 'update_todo',
  QUERY = 'query'
}
