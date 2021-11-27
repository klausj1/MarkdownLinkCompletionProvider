// ToDos:
// + Integrate into existing extension

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('The extension "markdownCompletionProvider" is now active!');

  const provider = vscode.languages.registerCompletionItemProvider('markdown',
  {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    if (!linePrefix.endsWith('\](#')) { // could be done better
      return undefined;
    }

    const editor = vscode.window.activeTextEditor;

    if (editor) {
      // read document
      const document = editor.document;
      let text = document.getText();
      let lines = text.replace('/\r\n/g','\n').split('\n'); // handle windows and unix line endings

      // read headers
      var headers = new Array();
      lines.forEach(function(line){
      let potentialHeader = isHeader(line);
      if (potentialHeader.found)
      {
        headers.push(potentialHeader.value);
      }
      });

      var completionItems = new Array();
      headers.forEach(function(header){
        completionItems.push(new vscode.CompletionItem(convertHeader2Link(header), vscode.CompletionItemKind.Method));
      });

      return completionItems;
    }
    else
    {
      return undefined;
    }
    }
  },
  '#' // triggered whenever a '#' is being typed
  );

  context.subscriptions.push(provider);
}

// returns true when line is a markdown header
function isHeader(line: string) {
  if (line.startsWith("#"))
  {
    return { found:true, value: line};
  }
  else
  {
    return { found:false, value: ""};
  }
}

// Converts header to link, see https://docs.gitlab.com/ee/user/markdown.html#header-ids-and-links
// Duplicate headers are not handled!
function convertHeader2Link(header: string): string {
  let link = header;
  link = link.replace(/^#* /g, ''); // Remove leading hashes ('#')
  link = link.trim();
  link = link.toLowerCase();
  link = link.replace(/[.*+\-?^${}():\/|[\]\\]/g, ''); // Remove special characters
  link = replaceSpaces(link); // replace spaces wit '-', and multiple '-' with one '-'
  return link;
}

function replaceSpaces(str: string) {
  str = str.replace(/ /g, '-');
  str = str.replace(/--+/g, '-');
  return str;
}

// this method is called when your extension is deactivated
export function deactivate() {}