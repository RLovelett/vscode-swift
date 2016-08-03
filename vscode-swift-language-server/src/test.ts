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
     * I think this would best be described as code points.
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
        for (let ch of this.toString()) {
            offset += Buffer.byteLength(ch, 'utf8');
            currentColumn += 1;

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

    constructor(uri: string, languageId: string = 'swift', version: number, content: string) {
        this._uri = uri;
        this._languageId = languageId;
        this._version = version;
        this._content = new Buffer(content);
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
            let text = this.getText();
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

let uri = '/Users/lovelett/Desktop/vscode-test/source.swift';
let source: Promise<Buffer> = new Promise((resolve, reject) => {
    fs.readFile(uri, (err, data) => {
        if (err) { reject(err); }
        else { resolve(data); }
    });
});

// REMEMBER Position is zero indexed!
// https://github.com/Microsoft/vscode-languageserver-node/blob/a9f36d43a789e6fd9c16e5e50fc818eb35d097db/types/src/main.ts#L12
let beginningOfDocument = Position.create(0, 0); // Should be byte-offset of 0
let endOfDocument = Position.create(4, 13);      // Should be byte-offset of 46
let position = Position.create(4, 12);           // Should be byte-offset of 45

source
    .then((buffer) => {
        let document = TextDocument.create(uri, 'swift', 1, buffer.toString('utf8'));
        let offset = document.offsetAt(position);
        console.log(`FullTextDocument Line Count: ${document.lineCount}`); // 5
        console.log(`FullTextDocument offset: ${offset}`); // 45

        return buffer;
    })
    .then((buffer) => {
        let document = new UnicodeTextDocument(uri, 'swift', 1, buffer.toString('utf8'));
        let byteOffset = document.offsetAt(position);
        console.log(`UnicodeTextDocument Line Count: ${document.lineCount}`); // 5
        console.log(`UnicodeTextDocument offset: ${byteOffset}`); // 45

        return buffer;
    });