'use strict';

import * as net from 'net';

import { workspace, ExtensionContext, Uri } from 'vscode';
import { ServerOptions, Executable, LanguageClient, LanguageClientOptions, TransportKind } from 'vscode-languageclient';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    // Load the path to the language server from settings
    const configuration = workspace.getConfiguration("swift");
    let executableCommand = configuration.get("languageServerExecutableCommand", "langserver-swift");
    let executablePath = configuration.get("languageServerEnvironmentPATH", "");
    executablePath = (executablePath === "") ? process.env.PATH : `${executablePath}:${process.env.PATH}`;
    let swiftBinaryDirectory = configuration.get("swiftBinaryDirectory", "/usr/local/bin");

    let run: Executable = {
        command: executableCommand,
        options: {
            env: {
                PATH: executablePath
            }
        }
    };
    let debug: Executable = run;
    let serverOptions: ServerOptions = {
        run: run,
        debug: debug
    };
    
    // client extensions configure their server
    let clientOptions: LanguageClientOptions = {
        documentSelector: [
            { language: 'swift', scheme: 'file' },
            { language: 'swift', scheme: 'untitled' }
        ],
        synchronize: {
            configurationSection: 'swift',
            fileEvents: [
                workspace.createFileSystemWatcher('**/*.swift', false, true, false),
                workspace.createFileSystemWatcher('**/.build/{debug,release}.yaml', false, false, false)
            ]
        },
        initializationOptions: {
            swiftBinaryDirectory
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