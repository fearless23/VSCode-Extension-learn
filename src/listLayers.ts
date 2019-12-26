import * as vscode from "vscode";
import * as path from "path";
import { getLayers } from "./aws";

export class LayerNodeProvider implements vscode.TreeDataProvider<Layer> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Layer | undefined
  > = new vscode.EventEmitter<Layer | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Layer | undefined> = this
    ._onDidChangeTreeData.event;

  constructor(private workspaceRoot?: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Layer): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<Layer[]> {
    const x = this.getLambdasForConfig();
    return Promise.resolve(x);
  }

  private async getLambdasForConfig(): Promise<Layer[]> {
    const lambdas = await getLayers();

    return lambdas.map(layer => {
      return new Layer(
        layer.LayerName,
        layer.LayerArn,
        layer.LayerName,
        vscode.TreeItemCollapsibleState.None,
        {
          command: "happyLambda.viewLayer",
          title: "View",
          arguments: [layer]
        }
      );
    });
  }
}

export class Layer extends vscode.TreeItem {
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

  contextValue = "layer";
}
