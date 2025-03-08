# Markdown Todo

Markdown Todo is a [FlowLauncher](https://www.flowlauncher.com) Plugin that allows users to interact with a markdown todo list from the FlowLauncher search bar. Users can list todos and change their state.

![Preview](/img/preview.png)

## Setup

### Installation

1. Open Flow Launcher.
2. Type `Settings`.
3. Open the Plugin Store.
4. Search for `MarkdownTodo`.
5. Install the plugin.

or enter `pm install MarkdownTodo` in the Flow Launcher search bar to install the plugin.

### Configuration

1. Open Flow Launcher.
2. Type `Settings`.
3. Open `Plugins`.
4. Find `MarkdownTodo`.
5. Select a folder where your markdown files are located using the browse button.
6. (Optional) Set a file name for the specific file you want to use.

If no filename is configured, all markdown files in the folder will be used.

The plugin allows you to use date placeholders in the folder path and file name. A placeholder starts with `{{` and ends with `}}`. The string between the placeholders is parsed with the [date-fns](https://date-fns.org/) library and is replaced with the formatted current date.

Example:

- {{yyyy-MM-dd}}.md
- Daily-{{dd}}-{{MM}}-{{yyyy}}.md

## Usage

1. Open Flow Launcher
2. Type `t`
3. Select a todo from the list to toggle its state

To filter the list of todos you can use the following options in the search bar:

- `title:` - Filter by title (default)
- `file:` - Filter by file name
- `folder:` - Filter by folder name
- `state:` - Filter by state

Not done state is `o` instead of a space.

Example:
`t file:my-todo.md state:o` - List all todos in the file `my-todo.md` that are not done.

## Thanks to

- [EmojiFinder plugin](https://github.com/kalvn/Flow.Launcher.Plugin.EmojiFinder) for providing a good example on how to create a FlowLauncher plugin.
- [Lucide](https://lucide.dev/) for the icons.
