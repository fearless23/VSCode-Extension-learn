import {
  TreeDataProvider,
  EventEmitter,
  Event,
  TreeItem,
  Command,
  TreeItemCollapsibleState
} from "vscode";
import { join } from "path";
import { getLayers } from "./aws";

export class LayerNodeProvider implements TreeDataProvider<Layer> {
  private _onDidChangeTreeData: EventEmitter<
    Layer | undefined
  > = new EventEmitter<Layer | undefined>();
  readonly onDidChangeTreeData: Event<Layer | undefined> = this
    ._onDidChangeTreeData.event;

  constructor(private workspaceRoot?: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Layer): TreeItem {
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
        TreeItemCollapsibleState.None,
        {
          command: "happyLambda.viewLayer",
          title: "View",
          arguments: [layer]
        }
      );
    });
  }
}

export class Layer extends TreeItem {
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

  contextValue = "layer";
}
