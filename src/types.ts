export type Methods = 'open_result' | 'update_todo' | 'get_todos_from_file';

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

  isDone (): boolean {
    return this.state !== ' ';
  }

  getFilePath (): string {
    return `${this.folderPath}/${this.fileName}`;
  }
}
