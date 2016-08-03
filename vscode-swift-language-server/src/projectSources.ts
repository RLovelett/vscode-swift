import {
    IConnection,
    TextDocument,
    DidChangeWatchedFilesParams,
    FileChangeType
} from 'vscode-languageserver';

import {
    swiftSourcesIn,
    stat,
    convertFileToTextDocument
} from './sourceSwiftInProject';

const uriPrefix = 'file://';

/**
 * Remove the prefix, if present, from a string and return the new string.
 *
 * @return The string argument without the prefix. If the string does not contain the prefix no
 * modification was made.
 */
function removePrefixFrom(string: string, prefix: string): string {
    if (string.startsWith(prefix)) {
        return string.substring(prefix.length);
    } else {
        return string;
    }
}

/**
 * A simple manager for the Swift sources in the workspace.
 */
export class ProjectSources {
    private _projectURI: string;
    private _sources: Map<string, TextDocument>;

    /**
     * Create a new `ProjectSources` instance to manage the sources for.
     * @param projectURI The URI to the project workspace.
     */
    constructor(projectURI: string) {
        this._projectURI = removePrefixFrom(projectURI, uriPrefix);
        this._sources = new Map<string, TextDocument>();

        swiftSourcesIn(this._projectURI).then((documents) => {
            for (let document of documents) {
                this._sources.set(document.uri, document);
            }
        });
    }

    /**
     * Generate a set of build arguments that will be sent to SourceKit
     * for the current set of project sources.
     *
     * @return the URI's of all Swift source documents.
     */
    public getBuildArgumentsFor(uri: string): string[] {
        let sources = Array.from(this._sources.keys());
        let uriWithoutPrefix = removePrefixFrom(uri, uriPrefix);
        let index = sources.indexOf(uriWithoutPrefix);
        if (index >= 0) {
            sources.splice(index, 1);
        }
        return sources;
    }

    /**
     * Listens for low level notification on the given connection to
     * update the text documents managed by this instance.
     *
     * @param connection The connection to listen on.
     */
    public listen(connection: IConnection): void {
        // This change watcher is looking for modifications to Swift source files
        // in the project workspace. It attempts to keep the `workspaceDocuments`
        // Map in sync with the actual files in the workspace.
        connection.onDidChangeWatchedFiles((change) => {
            for (let event of change.changes) {
                let uriWithoutPrefix = removePrefixFrom(event.uri, uriPrefix);
                switch (event.type) {
                    case FileChangeType.Created:
                        let applyToMap = this._sources.set.bind(this._sources, uriWithoutPrefix);
                        stat(uriWithoutPrefix)
                            .then(convertFileToTextDocument)
                            .then(applyToMap);
                        break;
                    case FileChangeType.Deleted:
                        this._sources.delete(uriWithoutPrefix)
                        break;
                }
            }
        });
    }
}