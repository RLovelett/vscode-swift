'use strict';

import * as net from 'net';

import { workspace, ExtensionContext, Uri } from 'vscode';
import { ServerOptions, Executable, LanguageClient, LanguageClientOptions, TransportKind } from 'vscode-languageclient';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    // Load the path to the language server from settings
    let executableCommand = workspace.getConfiguration("swift")
        .get("languageServerPath", "/usr/local/bin/LanguageServer");

    let run: Executable = { command: executableCommand };
    let debug: Executable = run;
    let serverOptions: ServerOptions = {
        run: run,
        debug: debug
    };
    
    // client extensions configure their server
    let clientOptions: LanguageClientOptions = {
        documentSelector: ['swift'],
        synchronize: {
            configurationSection: 'swift',
            fileEvents: [
                workspace.createFileSystemWatcher('**/*.swift', false, true, false),
                workspace.createFileSystemWatcher('**/.build/{debug,release}.yaml', false, false, false)
            ]
        }
    }

    let client = new LanguageClient('Swift', serverOptions, clientOptions);

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(client.start());
}

// this method is called when your extension is deactivated
export function deactivate() {
}