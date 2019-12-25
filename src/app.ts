import * as vscode from "vscode";
import { getLambdas } from "./aws";
import { wrapperView } from "./webViewHelper";
import { LambdaNodeProvider, LambdaFn } from "./listLambdas";
const vscError = function(msg: string) {
  return vscode.window.showErrorMessage(msg);
};

const vscMsg = function(msg: string) {
  return vscode.window.showInformationMessage(msg);
};

const onActivate = function() {
  try {
    const lnp = new LambdaNodeProvider();
    vscode.window.registerTreeDataProvider("listLambdas", lnp);
    vscode.commands.registerCommand("happyLambda.viewLambda", x => {
      // console.log("HEY: ", x);
      wrapperView({
        html: `<pre>${JSON.stringify(x, null, 2)}</pre>`,
        name: x.FunctionName || "Lambda"
      });
      // return vscMsg("Viewing Lambda");
    });
    vscode.commands.registerCommand("happyLambda.refreshLambdas", () => {
      lnp.refresh();
    });

    vscMsg("AWS Lambda Functions Loaded!");
  } catch (error) {
    return vscError("Failed to create boilerplate file!");
  }
};

export { onActivate };
