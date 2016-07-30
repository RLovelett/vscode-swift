/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { execFile } from 'child_process';

import {
	Swift,
	SwiftCompletionSuggestion,
} from './swiftSourceTypes';

import {
	IConnection, IPCMessageReader, IPCMessageWriter, createConnection,
	InitializeResult,
	DidChangeConfigurationParams, TextDocumentPositionParams, DocumentSymbolParams,
	CompletionItem, CompletionItemKind,
	SymbolInformation, SymbolKind,
	TextDocument, TextDocuments, Position, Range, Location
} from 'vscode-languageserver';

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

interface Settings {
	swift: ExampleSettings;
}

interface ExampleSettings {
	sourceKittenPath: string;
}

let sourceKittenPath: string;
connection.onDidChangeConfiguration((change: DidChangeConfigurationParams) => {
	let settings = <Settings>change.settings;
	sourceKittenPath = settings.swift.sourceKittenPath;
});

// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites.
let workspaceRoot: string;
connection.onInitialize((params): InitializeResult => {
	workspaceRoot = params.rootPath;
	return {
		capabilities: {
			// Tell the client that the server works in FULL text document sync mode
			textDocumentSync: documents.syncKind,
			// Tell the client that the server support code complete
			completionProvider: {
				resolveProvider: false,
				triggerCharacters: [
					' ', '.', ':', '<', '('
				]
			},
			// hoverProvider: true,
			documentSymbolProvider: true
		}
	}
});

connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): Thenable<CompletionItem[]> => {
	let document: TextDocument = documents.get(textDocumentPosition.textDocument.uri);
	let offset: number = document.offsetAt(textDocumentPosition.position);
	connection.console.log(offset.toString());

	let promise: Promise<CompletionItem[]> = new Promise((resolve, reject) => {
		execFile(sourceKittenPath, ['complete', '--text', document.getText(), '--offset', offset.toString()], (error, stdout, stderr) => {
			if (error) { reject(error); }
			else {
				let suggestions = <[SwiftCompletionSuggestion]>JSON.parse(stdout.toString());
				let items: CompletionItem[] = suggestions.map((suggestion, index, array): CompletionItem => {
					let item = CompletionItem.create(suggestion.descriptionKey);
					item.detail = `${suggestion.moduleName}.${suggestion.typeName}`;
					item.documentation = suggestion.docBrief;
					// default types
					item.kind = Swift.completionKindForSwiftType(suggestion.kind);

					let snippet = createSnippet(suggestion);

					// overrides
					console.log(suggestion.kind);

					switch (suggestion.kind) {
						case Swift.DeclModule:
							item.kind = CompletionItemKind.Module;
							break;
						case Swift.Keyword:
							item.detail = `Keyword: ${suggestion.name}`;
							item.documentation = '';
							item.kind = CompletionItemKind.Keyword;
							break;
						case Swift.DeclFunctionFree:
							item.kind = CompletionItemKind.Function;
							break;
						case Swift.DeclVarInstance:
						case Swift.DeclVarGlobal:
							item.kind = CompletionItemKind.Variable;
							break;
						case Swift.DeclProtocol:
							item.kind = CompletionItemKind.Interface;
							break;
						case Swift.DeclClass:
							item.kind = CompletionItemKind.Class;
							break;
						case Swift.DeclStruct:
							item.kind = CompletionItemKind.Value;
							break;
						case Swift.DeclFunctionConstructor:
							item.kind = CompletionItemKind.Constructor;
							item.insertText = suggestion.sourcetext;
							item.documentation = suggestion.descriptionKey;
							// remove leading and trailing parens
							snippet = snippet.substr(1, snippet.length - 2)
							break;
						case Swift.DeclEnum:
							item.kind = CompletionItemKind.Enum;
							break;
						case Swift.DeclTypealias:
							item.kind = CompletionItemKind.Reference;
							break;
					}
					if (snippet.length != suggestion.sourcetext.length) {
						item.insertText = snippet;
					}
					return item;
				});
				resolve(items);
			}
		});
	});
	return promise;
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return item;
});

connection.onDocumentSymbol((documentSymbolParams: DocumentSymbolParams): Thenable<SymbolInformation[]> => {
	let document: TextDocument = documents.get(documentSymbolParams.textDocument.uri);
	let promise: Promise<SymbolInformation[]> = new Promise((resolve, reject) => {
		execFile(sourceKittenPath, ['structure', '--text', document.getText()], (error, stdout, stderr) => {
			if (error) { reject(error); }
			else {
				let json: any[] = JSON.parse(stdout.toString());
				let substructure: any[] = json['key.substructure'];
				let symbols: SymbolInformation[] = substructure.map((value, index, array): SymbolInformation => {
					let start: Position = document.positionAt(value['key.nameoffset']);
					let end: Position = document.positionAt(value['key.nameoffset'] + value['key.namelength']);
					let range: Range = Range.create(start, end);
					let symbolLocation: Location = Location.create(documentSymbolParams.textDocument.uri, range);
					let symbol = {
						name: value['key.name'],
						kind: 3,
						location: symbolLocation
					};
					// TODO use swift types?
					switch (value['key.kind']) {
						case 'source.lang.swift.decl.var.global':
							symbol.kind = SymbolKind.Variable;
							break;
						case 'source.lang.swift.expr.call':
							symbol.kind = SymbolKind.Function;
							break;
						case 'source.lang.swift.decl.struct':
							symbol.kind = SymbolKind.Class;
							break;
						case 'source.lang.swift.decl.protocol':
							symbol.kind = SymbolKind.Interface;
							break;
						case 'source.lang.swift.decl.enum':
							symbol.kind = SymbolKind.Enum;
							break;
						default:
							connection.console.log(`Unmatched Symbol: ${value['key.kind']}`);
							break;
					}
					return symbol;
				});
				resolve(symbols);
			}
		});
	});
	return promise;
});

// Listen on the connection
connection.listen();

// Helpers

/**
 * Creates a snippet formatted string with cursor positions from sourcekit sourcetext
 *
 * @param {SwiftCompletionSuggestion} suggestion
 * @returns {string}
 */
function createSnippet(suggestion: SwiftCompletionSuggestion): string {
	let cursorIndex = 1
	const replacer = suggestion.sourcetext.replace(/<#T##(.+?)#>/g, (_, group) => {
		return `\{{${cursorIndex++}:${group.split('##')[0]}}}`;
	});
	return replacer.replace('<#code#>', `\{{${cursorIndex++}}}`);
};
