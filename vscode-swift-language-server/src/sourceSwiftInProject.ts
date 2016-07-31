import * as fs from 'fs';
import * as Path from 'path';
import { TextDocument } from 'vscode-languageserver';

interface File {
    uri: string;
    stat: fs.Stats;
}

/**
 * Closure to check if a File instance is a Swift source.
 *
 * A Swift source is a file that is a file on the filesystem and has a .swift extension.
 */
let isSwiftSource = (file: File): boolean => {
    return file.stat.isFile() && file.uri.endsWith('.swift');
}

/**
 * Closure to check if a File instance is a directory.
 */
let isDirectory = (file: File): boolean => {
    return file.stat.isDirectory();
}

/**
 * Closure to convert a multi-dimensional array of Files to a single dimensional array.
 */
let flatten = (array: File[][]): File[] => {
    return array.reduce((a, b) => { return a.concat(b); }, []);
}

/**
 * Read the contents of a file and convert it to a TextDocument.
 *
 * @param file The file to convert to a TextDocument.
 * @returns A TextDocument instance for a given file.
 */
export function convertFileToTextDocument(file: File): Promise<TextDocument> {
    return new Promise((resolve, reject) => {
        fs.readFile(file.uri, (err, data) => {
            if (err) { reject(err); }
            else {
                let document = TextDocument.create(file.uri, 'swift', 0, data.toString('utf8'));
                resolve(document);
            }
        });
    });
}

/**
 * Extract the file system statistics for a supplied file.
 *
 * @param path The file or directory to gather filesystem statistics about.
 * @returns The file or directory's filesystem statistics.
 */
export function stat(path: string): Promise<File> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) { reject(err); }
            else {
                resolve({ uri: path, stat: stats });
            }
        });
    });
}

/**
 * Recursively find all files and directories in a supplied directory.
 *
 * @param directory The directory to recursively search for files and directories.
 * @returns A flattened collection of all the files and directories and their children.
 */
function statDirectory(directory: string): Promise<File[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            let allFiles: File[] = [];
            let appendFiles = (files: File[]): Promise<File[]> => {
                allFiles = allFiles.concat(files);
                return Promise.resolve(files);
            };
            // TODO: Can we make the first map lazy?
            let promises = files
                .map((file) => { return Path.join(directory, file) })
                .map(stat);
            Promise.all(promises)
                .then(appendFiles)
                .then((files: File[]) => {
                    let subDirectories = files.filter(isDirectory).map((file) => { return statDirectory(file.uri); });
                    return Promise.all(subDirectories).then(flatten);
                })
                .then(appendFiles)
                .then((files: File[]) => {
                    resolve(allFiles);
                })
                .catch(reject);
        });
    });
}

/**
 * Recursively find all the files with a Swift extension in a supplied directory.
 *
 * @param directory The directory to recursively search for Swift sources.
 * @returns A flattened collection of all the Swift sources as TextDocument instances.
 */
export function swiftSourcesIn(directory: string): Promise<TextDocument[]> {
    return statDirectory(directory).then((files: File[]) => {
        return Promise.all(files.filter(isSwiftSource).map(convertFileToTextDocument))
            .then(n => n);
    });
}