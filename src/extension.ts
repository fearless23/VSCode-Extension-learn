import * as vscode from "vscode";
import { onActivate } from "./app";

export function activate(context: vscode.ExtensionContext) {
  // let disposable = vscode.commands.registerCommand(
  //   "happyLambda.createBoilerplates",
  //   async () => onActivate()
  // );

  // // vscode.

  // context.subscriptions.push(disposable);
  onActivate()
}

// this method is called when your extension is deactivated
export function deactivate() {}
