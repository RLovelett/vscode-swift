import * as fs from 'fs';
import { TextDocument, Position } from 'vscode-languageserver';

class UnicodeLine {
    private _buffer: Buffer;
    private _byteOffset: number;

    constructor(line: Buffer, byteOffset: number) {
        this._buffer = line;
        this._byteOffset = byteOffset;
    }

    /**
     * I think this would best be described as code points. (NO IT IS NOT!)
     */
    get columns(): number {
        return this.toString().length + 1;
    }

    offsetAt(column: number): number {
        if (column >= this.columns) {
            return this._byteOffset + this._buffer.length;
        } else if (column <= 0) {
            return this._byteOffset;
        }
        let offset = this._byteOffset;
        let currentColumn = 0;
        let text = this._buffer.toString('utf8');
        let characterIterator = text[Symbol.iterator]();
        let result = characterIterator.next();
        while (!result.done) {
            const ch = result.value;
            let length = Buffer.byteLength(ch, 'utf8');
            offset += length;
            currentColumn += 1;
            result = characterIterator.next();

            if (currentColumn === column) {
                break;
            }
        }
        return offset;
    }

    toString(): string {
        return this._buffer.toString('utf8');
    }
}

export class UnicodeTextDocument implements TextDocument {
    private _uri: string;
    private _languageId: string;
    private _version: number;
    private _content: Buffer;
    private _lineOffsets: UnicodeLine[];

    constructor(uri: string, languageId: string = 'swift', version: number, content: Buffer) {
        this._uri = uri;
        this._languageId = languageId;
        this._version = version;
        this._content = content;
        this._lineOffsets = null;
    }

    get uri(): string {
        return this._uri;
    }

    get languageId(): string {
        return this._languageId;
    }

    get version(): number {
        return this._version;
    }

    getText(): string {
        return this._content.toString('utf8');
    }

    positionAt(offset: number): Position {
        return Position.create(0, 0);
    }

    offsetAt(position: Position): number {
        let lines = this.getLineOffsets();
        if (position.line >= lines.length) {
            return this.bytes;
        } else if (position.line < 0) {
            return 0;
        }

        let line = lines[position.line];
        return line.offsetAt(position.character);
    }

    get lineCount(): number {
        return this.getLineOffsets().length;
    }

    get bytes(): number {
        return this._content.length;
    }

    private getLineOffsets(): UnicodeLine[] {
        if (this._lineOffsets === null) {
            let text = this._content;

            let line0 = text.slice(0, 13);
            let line1 = text.slice(13, 30);
            let line2 = text.slice(30, 32);
            let line3 = text.slice(32, 33);
            let line4 = text.slice(33);
            let lineOffsets: UnicodeLine[] = [
                new UnicodeLine(new Buffer(line0),  0),
                new UnicodeLine(new Buffer(line1), 13),
                new UnicodeLine(new Buffer(line2), 30),
                new UnicodeLine(new Buffer(line3), 32),
                new UnicodeLine(new Buffer(line4), 33)
            ];

            this._lineOffsets = lineOffsets;
        }
        return this._lineOffsets;
    }
}

const ascii = '/Users/lovelett/Desktop/vscode-test/ascii.swift';
const unicode = '/Users/lovelett/Desktop/vscode-test/unicode.swift';

// Load the text documents
let asciiBuffer: Promise<Buffer> = new Promise((resolve, reject) => {
    fs.readFile(ascii, (err, data) => {
        if (err) { reject(err); }
        else { resolve(data); }
    });
});

let unicodeBuffer: Promise<Buffer> = new Promise((resolve, reject) => {
    fs.readFile(unicode, (err, data) => {
        if (err) { reject(err); }
        else { resolve(data); }
    });
});

// REMEMBER Position is zero indexed!
// https://github.com/Microsoft/vscode-languageserver-node/blob/a9f36d43a789e6fd9c16e5e50fc818eb35d097db/types/src/main.ts#L12
// let position = Position.create(0,  0); // Should be byte-offset of 0
// let position = Position.create(4,  3); // Should be byte-offset of 36
// let position = Position.create(4,  4); // Should be byte-offset of 37
// let position = Position.create(4,  5); // Should be byte-offset of ascii: 38, unicode: 41
// let position = Position.create(4, 12); // Should be byte-offset of ascii: 45, unicode: 48
let position = Position.create(4, 13); // Should be byte-offset of ascii: 46, unicode: 49

asciiBuffer.then((buffer) => TextDocument.create(ascii, 'swift', 1, buffer.toString('utf8')))
  .then((document) => document.offsetAt(position))
  .then(console.log);

unicodeBuffer.then((buffer) => TextDocument.create(unicode, 'swift', 1, buffer.toString('utf8')))
  .then((document) => document.offsetAt(position))
  .then(console.log);

asciiBuffer.then((buffer) => new UnicodeTextDocument(ascii, 'swift', 1, buffer))
  .then((document) => document.offsetAt(position))
  .then(console.log);

unicodeBuffer.then((buffer) => new UnicodeTextDocument(unicode, 'swift', 1, buffer))
  .then((document) => document.offsetAt(position))
  .then(console.log);