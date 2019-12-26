import {
  TreeDataProvider,
  EventEmitter,
  Event,
  TreeItem,
  Command,
  TreeItemCollapsibleState
} from "vscode";
import { join } from "path";
import { getLambdas } from "./aws";

export class LambdaNodeProvider implements TreeDataProvider<LambdaFn> {
  private _onDidChangeTreeData: EventEmitter<
    LambdaFn | undefined
  > = new EventEmitter<LambdaFn | undefined>();
  readonly onDidChangeTreeData: Event<LambdaFn | undefined> = this
    ._onDidChangeTreeData.event;

  constructor(private workspaceRoot?: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: LambdaFn): TreeItem {
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
        TreeItemCollapsibleState.None,
        {
          command: "happyLambda.viewLambda",
          title: "View",
          arguments: [lambda]
        }
      );
    });
  }
}

export class LambdaFn extends TreeItem {
  constructor(
    public readonly label: string | undefined,
    private arn: string | undefined,
    private name: string | undefined,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command
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
    light: join(__filename, "..", "..", "resources", "dark", "lambda.svg"),
    dark: join(__filename, "..", "..", "resources", "dark", "lambda.svg")
  };

  contextValue = "lambdaFn";
}
