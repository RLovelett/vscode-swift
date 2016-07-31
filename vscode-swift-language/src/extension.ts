'use strict';

import * as Path from 'path';

import { workspace, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, TransportKind } from 'vscode-languageclient';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    let serverModule = context.asAbsolutePath(Path.join('server', 'server.js'));
    let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
    let serverOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };
    
    // client extensions configure their server
    let clientOptions: LanguageClientOptions = {
        documentSelector: ['swift'],
        synchronize: {
            configurationSection: 'swift',
            fileEvents: workspace.createFileSystemWatcher('**/*.swift', false, true, false)
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