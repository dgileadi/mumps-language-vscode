let fs = require('fs');
let path = require('path');
let vscode = require('vscode');
let Location = vscode.Location;
let Position = vscode.Position;
let Uri = vscode.Uri;
let MumpsToken = require('./mumps-language-token').MumpsToken;
const EXTENSIONS = ['.M', '.INT', '.ZWR', '.m', '.int', '.zwr'];

class MumpsDefinitionProvider {
    provideDefinition(document, position) {
        let token = new MumpsToken(document, position);
        if (token.isLabelReference) {
            let uri = token.labelProgram ?
                siblingUri(document, token.labelProgram) :
                document.uri;
            let labelPosition = token.label ?
                findLabelPositionInFile(uri, token.label, token.labelOffset) :
                token.labelOffset ?
                    document.positionAt(token.labelOffset) :
                    new Position(0, 0);
            return new Location(uri, labelPosition);
        }
    }
}
exports.MumpsDefinitionProvider = MumpsDefinitionProvider;

function siblingUri(document, fileName) {
    let siblingPath = path.resolve(document.uri.fsPath, '../' + fileName);
    if (!fs.existsSync(siblingPath)) {
        for (var extension of EXTENSIONS) {
            let extendedPath = siblingPath + extension;
            if (fs.existsSync(extendedPath)) {
                siblingPath = extendedPath;
                break;
            }
        }
    }
    return Uri.file(siblingPath);
}

function findLabelPositionInFile(uri, label, offset) {
    let line = offset || 0;
    if (label) {
        try {
            let text = fs.readFileSync(uri.fsPath, 'utf8');
            let labelRe = new RegExp('^' + label + '[ \t\\()]', 'm');
            let result = labelRe.exec(text);
            if (result) {
                line += countLines(text, result.index);
            }
        } catch (e) {}
    }
    return new Position(line, 0);
}

function countLines(text, index) {
    if (index >= text.length) {
        index = text.length - 1;
    }
    let re = /[\r\n]+/g;
    let result;
    let line = 0;
    while ((result = re.exec(text)) && result.index >= 0 && result.index < index) {
        ++line;
    }
    return line;
}
