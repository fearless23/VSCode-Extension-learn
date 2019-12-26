import * as vscode from "vscode";
import { wrapperView } from "./webViewHelper";
import { LambdaNodeProvider } from "./listLambdas";
import { LayerNodeProvider } from "./listLayers";
import { getLambdaLogs } from "./aws";
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

    vscode.commands.registerCommand(
      "happyLambda.viewLambda",
      async (x) => {
        const y = await getLambdaLogs(x.FunctionName || "");
        wrapperView({
          html: `<pre>${JSON.stringify(x, null, 2)}</pre><pre>${JSON.stringify(
            y,
            null,
            2
          )}</pre>`,
          name: x.FunctionName || "Lambda"
        });
        // return vscMsg("Viewing Lambda");
      }
    );
    vscode.commands.registerCommand("happyLambda.refreshLambdas", () => {
      lnp.refresh();
    });

    const lynp = new LayerNodeProvider();
    vscode.window.registerTreeDataProvider("listLayers", lynp);
    vscode.commands.registerCommand(
      "happyLambda.viewLayer",
      (x) => {
        wrapperView({
          html: `<pre>${JSON.stringify(x, null, 2)}</pre>`,
          name: x.LayerName || "Layer"
        });
        // return vscMsg("Viewing Lambda");
      }
    );
    vscode.commands.registerCommand("happyLambda.refreshLayers", () => {
      lynp.refresh();
    });

    vscMsg("AWS Lambda Functions Loaded!");
  } catch (error) {
    return vscError("Failed to create boilerplate file!");
  }
};

export { onActivate };
