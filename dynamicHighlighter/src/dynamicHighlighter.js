const vscode = require("vscode");

/**
 * This method is called when the extension is activated.
 * Your extension is activated the very first time the command is executed.
 */
function activate(context) {
  // Register a semantic token provider
  let selector = { language: "javascript", scheme: "file" };
  let provider = new DynamicHighlighter();
  let legend = new vscode.SemanticTokensLegend([
    "variable",
    "function",
    "titleRelated",
  ]);

  context.subscriptions.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      selector,
      provider,
      legend
    )
  );
}

class DynamicHighlighter {
  provideDocumentSemanticTokens(document) {
    const builder = new vscode.SemanticTokensBuilder();
    const text = document.getText();
    const titlePattern = /title/i;
    const variablePattern = /\b(let|var|const) (\w+)/g;

    // Example: Apply 'titleRelated' token to matches
    let match;
    while ((match = titlePattern.exec(text))) {
      const start = document.positionAt(match.index);
      const end = document.positionAt(match.index + match[0].length);
      builder.push(new vscode.Range(start, end), "titleRelated");
    }

    // Apply 'variable' token to variables
    while ((match = variablePattern.exec(text))) {
      const start = document.positionAt(match.index);
      const end = document.positionAt(match.index + match[0].length);
      builder.push(new vscode.Range(start, end), "variable");
    }

    return builder.build();
  }
}

/**
 * This method is called when the extension is deactivated.
 */
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
