// ToDos:
// + Substitute special characters (check links from Task in Microsoft Todo to find something useful)
// + Create extension to install in company
// + Integrate into existing extension


// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Event, TextDocumentChangeEvent, Uri } from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdownCompletionProvider" is now active!');

    // ToDo:
	// Fetch headers from current document
	// offer headers as code completion
	const provider = vscode.languages.registerCompletionItemProvider(
		'markdown',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				console.log("CompletionProvider called!");
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('\](#')) {
					return undefined;
				}

				const editor = vscode.window.activeTextEditor;

				if (editor) {
					// read document
					const document = editor.document;
					let text = document.getText();
					let lines = text.split('\r\n');

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
		'#' // triggered whenever a '#' is being typed; strange, the completionprovider is always trigged, but the completionitems are only triggered when this character is pressed.
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
	// ToDo Check https://docs.gitlab.com/ee/user/markdown.html#header-ids-and-links, remove special characters, ...
	let link = header;
	link = replaceAll(link,'#',''); // ToDo: Bug, should only remove all # until the first different character
	link = link.trim();
	link = link.toLowerCase();
	link = replaceAll(link,' ', '-');
	return link;
}

function replaceAll(str: string, find: string, replace: string) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

function escapeRegExp(str:string) {
  return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// this method is called when your extension is deactivated
export function deactivate() {}