let vscode = require('vscode');
let MumpsHoverProvider = require('./mumps-hover-provider').MumpsHoverProvider;
let MumpsDefinitionProvider = require('./mumps-definition-provider').MumpsDefinitionProvider;
let MumpsSignatureHelpProvider = require('./mumps-signature-help-provider').MumpsSignatureHelpProvider;

function activate(context) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            'mumps', new MumpsHoverProvider()));
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            'mumps', new MumpsDefinitionProvider()));
    context.subscriptions.push(
        vscode.languages.registerSignatureHelpProvider(
            'mumps', new MumpsSignatureHelpProvider(), '(', ','));
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;