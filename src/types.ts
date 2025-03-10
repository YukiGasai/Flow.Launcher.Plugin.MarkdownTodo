export type Methods = 'add_todo' | 'delete_todo' | 'update_todo';

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
