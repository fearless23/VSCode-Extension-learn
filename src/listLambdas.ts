import * as vscode from "vscode";
import * as path from "path";
import { getLambdas } from "./aws";

export class LambdaNodeProvider implements vscode.TreeDataProvider<LambdaFn> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    LambdaFn | undefined
  > = new vscode.EventEmitter<LambdaFn | undefined>();
  readonly onDidChangeTreeData: vscode.Event<LambdaFn | undefined> = this
    ._onDidChangeTreeData.event;

  constructor(private workspaceRoot?: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: LambdaFn): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<LambdaFn[]> {
    const x = this.getLambdasForConfig();
    return Promise.resolve(x);
  }

  private async getLambdasForConfig(): Promise<LambdaFn[]> {
    const lambdas = await getLambdas();

    return lambdas.map(lambda => {
      return new LambdaFn(
        lambda.FunctionName,
        lambda.FunctionArn,
        lambda.FunctionName,
        vscode.TreeItemCollapsibleState.None,
        {
          command: "happyLambda.viewLambda",
          title: "View",
          arguments: [lambda]
        }
      );
    });
  }
}

export class LambdaFn extends vscode.TreeItem {
  constructor(
    public readonly label: string | undefined,
    private arn: string | undefined,
    private name: string | undefined,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label || "No Name", collapsibleState);
  }

  get tooltip(): string {
    return `${this.label}-${this.arn}`;
  }

  get description(): string | undefined {
    return this.name;
  }

  iconPath = {
    light: path.join(__filename, "..", "..", "resources", "dark", "lambda.svg"),
    dark: path.join(__filename, "..", "..", "resources", "dark", "lambda.svg")
  };

  contextValue = "lambdaFn";
}

// private async getLambda(LambdaName: string): Promise<LambdaFn | null> {
//   const lambdas = await getLambdas();
//   if (lambdas.length === 0) {
//     return null;
//   } else {
//     let l: LambdaFn;
//     lambdas.forEach(lambda => {
//       if (lambda.FunctionName === LambdaName) {
//         const ll = new LambdaFn(
//           lambda.FunctionName,
//           lambda.FunctionArn,
//           lambda.FunctionName,
//           vscode.TreeItemCollapsibleState.None,
//           {
//             command: "happyLambda.viewLambda",
//             title: "View"
//             //   arguments: [moduleName]
//           }
//         );
//         l = ll;
//         return;
//       }
//     });
//     return l;
//   }
// }
