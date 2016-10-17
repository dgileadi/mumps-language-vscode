let vscode = require('vscode');
let Hover = vscode.Hover;
let MumpsToken = require('./mumps-language-token').MumpsToken;
const definitions = require('./language-definitions.json');

const definitionsByName = {};
for (var definition of definitions) {
    addDefinition(definition.name, definition);
    if (definition.abbreviation) {
        addDefinition(definition.abbreviation, definition);
    }
}

function addDefinition(name, definition) {
    if (!definitionsByName[name]) {
        definitionsByName[name] = [definition];
    } else {
        definitionsByName[name].push(definition);
    }
}

class MumpsHoverProvider {
    provideHover(document, position) {
        let token = new MumpsToken(document, position);

        if (!token.mayBeCommand && !token.isIntrinsic) {
            return;
        }

        let definitions = definitionsByName[token.word.toUpperCase()];
        if (definitions) {
            for (definition of definitions) {
                if (token.isFunctionCall && definition.type !== 'function') {
                    continue;
                }
                var markdown = '**' + definition.name + '**: ' + definition.description;
// TODO: function parameters
                return new Hover(markdown, token.range);
            }
        }
    }
}
exports.MumpsHoverProvider = MumpsHoverProvider;
