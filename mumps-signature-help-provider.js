let vscode = require('vscode');
let ParameterInformation = vscode.ParameterInformation;
let Position = vscode.Position;
let SignatureHelp = vscode.SignatureHelp;
let SignatureInformation = vscode.SignatureInformation;
let MumpsToken = require('./mumps-language-token').MumpsToken;

class MumpsSignatureHelpProvider {
    provideSignatureHelp(document, position) {
        let line = document.lineAt(position);
        if (!line) {
            return;
        }

        let definition;
        let index = position.character;
        while (!definition && index > 0) {
            index = line.text.lastIndexOf('(', index) - 1;
            if (index < 0) {
                break;
            }
            let token = new MumpsToken(document, new Position(position.line, index));
            definition = token.definition;
        }
        if (!definition) {
            return;
        }

        let signature = createSignatureInformation(definition);

        let help = new SignatureHelp();
        help.signatures = [signature];
        help.activeSignature = 0;
        help.activeParameter = calculateActiveParameter(line.text, index + 1, position.character);
        return help;
    }
}
exports.MumpsSignatureHelpProvider = MumpsSignatureHelpProvider;

function createSignatureInformation(definition) {
    let signature = new SignatureInformation(definition.functionSignature, definition.description);
    if (definition.parameters) {
        signature.parameters = [];
        for (var parameter of definition.parameters) {
            var description = parameter.optional ? '(optional) ' : '';
            description += parameter.description || parameter.name;
            signature.parameters.push(new ParameterInformation(parameter.name, description));
        }
    }
    return signature;
}

function calculateActiveParameter(lineText, parametersStartIndex, insertIndex) {
    let active = 0;
    let depth = 0;
    for (var i = parametersStartIndex + 1; i < insertIndex; i++) {
        let char = lineText.charAt(i);
        if (char === '(') {
            depth++;
        } else if (char === '(') {
            depth--;
        } else if (char === ',' && depth === 0) {
            active++;
        }
    }
    return active;
}