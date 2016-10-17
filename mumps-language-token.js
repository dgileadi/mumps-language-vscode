let vscode = require('vscode');
let Position = vscode.Position;
let Range = vscode.Range;

class MumpsToken {
    constructor(document, position) {
        this.document = document;
        this.position = position;

        this.range = document.getWordRangeAtPosition(position);
        if (!this.range) {
            return;
        }

        this.word = document.getText(this.range);
        if (!this.word) {
            return;
        }

        this.surroundWord = getWordWithSurrounds(document, this.range) || this.word;

        if (this.isIntrinsic) {
            this.word = '$' + this.word;
        }
    }

    get mayBeCommand() {
        if (!this.surroundWord) {
            return false;
        }
        var lastChar = this.surroundWord.charAt(this.surroundWord.length - 1);
        return isWhitespace(this.surroundWord.charAt(0)) &&
            (lastChar === ':' ||
                isWhitespace(lastChar) ||
                this.surroundWord.length === this.word.length + 1);   // end-of-line
    }

    get isIntrinsic() {
        if (!this.surroundWord) {
            return false;
        }
        return this.surroundWord.charAt(0) === '$';
    }

    get isFunctionCall() {
        if (!this.surroundWord) {
            return false;
        }
        return this.surroundWord.charAt(this.surroundWord.length - 1) === '(';
    }

    get isLabelReference() {
        if (this._isLabelReference === undefined) {
            let line = this.document.lineAt(this.range.start);
            let regex = new RegExp('[ \t](D|DO|G|GOTO)[ \t]+([%\\^\\+A-Z0-9]*' + this.word + '[%\\^\\+A-Z0-9]*)', 'i');
            let match = regex.exec(line.text);
            this._isLabelReference = match !== null;
            if (match) {
                let fullLabel = match[2];
                let partsRegex = /([%A-Z][%A-Z0-9]*)?(\+\d+)?(\^[%A-Z][%A-Z0-9]*)?/gi;
                let parts = partsRegex.exec(fullLabel);
                this.label = parts[1];
                this.labelOffset = withoutFirstCharacter(parts[2]);
                this.labelProgram = withoutFirstCharacter(parts[3]);
            }
        }
        return this._isLabelReference;
    }
}
exports.MumpsToken = MumpsToken;

function getWordWithSurrounds(document, range) {
    if (range.start.character <= 0) {
        return;
    }
    let start = new Position(range.start.line, range.start.character - 1);
    let end = new Position(range.end.line, range.end.character + 1);
    return document.getText(new Range(start, end));
}

function isWhitespace(char) {
    return /\s+/.test(char);
}

function withoutFirstCharacter(string) {
    return string ? string.substring(1) : string;
}