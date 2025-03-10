export type Result<T, E = Error> = | { data: T; error: null } | { data: null; error: E };

export class Todo {
  constructor (
    public title: string,
    public state: string,
    public folderPath: string,
    public fileName: string
  ) {
    this.title = title;
    this.state = state;
    this.folderPath = folderPath;
    this.fileName = fileName;
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
}

export interface FlowResult {
  Title: string;
  Subtitle?: string;
  JsonRPCAction: {
    method?: string;
    parameters: string[];
    dontHideAfterAction: boolean;
  };
  IcoPath?: string;
  score: number;
}
