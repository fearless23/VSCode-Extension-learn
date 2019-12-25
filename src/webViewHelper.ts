import * as vscode from "vscode";
// import * as path from "path";

interface helperView {
  cwd?: string;
  html: string;
  name: string;
}

export async function wrapperView(a: helperView) {
  const { cwd, html, name } = a;
  //   const staticCss = "resources/webview/build/static/css";

  //   const cssFiles = [
  //     vscode.Uri.file(path.join(cwd, staticCss, "main1.css")),
  //     vscode.Uri.file(path.join(cwd, staticCss, "main2.css"))
  //   ];

  let webviewPanel = vscode.window.createWebviewPanel(
    `${name}-webview`,
    name,
    vscode.ViewColumn.One,
    {
      enableScripts: true
    }
  );

  //   const cssFilesSrc = cssFiles.map(
  //     cssFile =>
  //       `<link href="${webviewPanel.webview.asWebviewUri(
  //         cssFile
  //       )}" rel="stylesheet" />`
  //   );

  // ${cssFilesSrc.join("\n")}
  webviewPanel.webview.html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
          body {
            padding: 1em 4.5em;
            line-height: 1.7;
          }
          h1, h2, h3 {
            padding-top: 1em
          }
          div{
              color: red;
          }
          pre {
            font-size:1.5em;
            line-height:1.6;
            padding: 1em;
            border-radius: 3px;
            overflow: auto;
          }
          .vscode-light pre, .vscode-light code {
            background: rgba(220, 220, 220, 0.4);
          }
          .vscode-dark pre, .vscode-dark code {
            background: rgba(10, 10, 10, 0.2);
          }
          
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
    `;

  webviewPanel.webview.onDidReceiveMessage(async message => {
    await vscode.commands.executeCommand(message.command);
  });
}
