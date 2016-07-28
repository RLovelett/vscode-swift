/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { execFile } from 'child_process';

import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams, DocumentSymbolParams,
	CompletionItem, CompletionItemKind,
	Hover, DocumentHighlight, SymbolInformation, SymbolKind, Location, Range, Position,
	DidOpenTextDocumentParams, DidChangeTextDocumentParams, DidCloseTextDocumentParams
} from 'vscode-languageserver';

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

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

connection.onHover((params, token): Hover => {
	connection.console.log('Got a hover!');
	return {
		contents: 'TODO'
	};
});

connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): Thenable<CompletionItem[]> => {
	let document: TextDocument = documents.get(textDocumentPosition.textDocument.uri);
	let offset: number = document.offsetAt(textDocumentPosition.position);
	connection.console.log(offset.toString());

	let promise: Promise<CompletionItem[]> = new Promise((resolve, reject) => {
		execFile('/usr/local/bin/sourcekitten', ['complete', '--text', document.getText(), '--offset', (offset - 1).toString()], (error, stdout, stderr) => {
			if (error) { reject(error); }
			else {
				let json: any[] = JSON.parse(stdout.toString());
				let items: CompletionItem[] = json.map((value, index, array): CompletionItem => {
					if (value.num_bytes_to_erase) {
						connection.console.log(value);
					}
					let item = CompletionItem.create(value.name);
					item.detail = `${value.moduleName}.${value.typeName}`;
					item.documentation = value.docBrief;
					switch (value.kind) {
						case "source.lang.swift.keyword":
							item.detail = `Keyword: ${value.name}`;
							item.documentation = '';
							item.kind = CompletionItemKind.Keyword;
							break;
						case "source.lang.swift.decl.function.free":
							item.kind = CompletionItemKind.Function;
							break;
						case "source.lang.swift.decl.var.instance":
						case "source.lang.swift.decl.var.global":
							item.kind = CompletionItemKind.Variable;
							break;
						case "source.lang.swift.decl.protocol":
							item.kind = CompletionItemKind.Interface;
							break;
						case "source.lang.swift.decl.class":
							item.kind = CompletionItemKind.Class;
							break;
						case "source.lang.swift.decl.struct":
							item.kind = CompletionItemKind.Value;
							break;
						case "source.lang.swift.decl.function.constructor":
							item.kind = CompletionItemKind.Constructor;
							item.insertText = value.sourcetext;
							item.documentation = value.descriptionKey;
							break;
						case "source.lang.swift.decl.enum":
							item.kind = CompletionItemKind.Enum;
							break;
						case "source.lang.swift.decl.typealias":
							item.kind = CompletionItemKind.Reference;
							break;
						default:
							connection.console.log(`Unmatched: ${value.kind}`);
							break;
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

connection.onDocumentHighlight((textDocumentPosition: TextDocumentPositionParams): Thenable<DocumentHighlight[]> => {
	return Promise.resolve([]);
});

connection.onDocumentSymbol((documentSymbolParams: DocumentSymbolParams): Thenable<SymbolInformation[]> => {
	let document: TextDocument = documents.get(documentSymbolParams.textDocument.uri);
	let promise: Promise<SymbolInformation[]> = new Promise((resolve, reject) => {
		execFile('/usr/local/bin/sourcekitten', ['structure', '--text', document.getText()], (error, stdout, stderr) => {
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