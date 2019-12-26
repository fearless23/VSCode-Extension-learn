import { config, SharedIniFileCredentials } from "aws-sdk/global";
import * as Lambda from "aws-sdk/clients/lambda";
import * as CloudWatchLogs from "aws-sdk/clients/cloudwatchlogs";

let inner: Lambda.ClientConfiguration;
export const setConfig = function(
  key: string,
  secret: string,
  region?: string
) {
  inner = {
    credentials: {
      accessKeyId: key,
      secretAccessKey: secret
    },
    region: region || "ap-south-1"
  };
};

export const setConfigFromCLI = function(profile: string, region: string) {
  const credentials = new SharedIniFileCredentials({
    profile: "default"
  });
  config.credentials = credentials;
  config.region = region;
};

setConfigFromCLI("default", "ap-south-1");

export async function getLambdas() {
  const lambda = new Lambda();
  const { NextMarker, Functions } = await lambda.listFunctions().promise();
  if (!Functions) {
    return [];
  }
  const functions: Lambda.FunctionConfiguration[] = [];
  Functions.forEach(fn => functions.push(fn));
  return functions;
}

export async function getLayers() {
  const lambda = new Lambda();
  const { NextMarker, Layers } = await lambda.listLayers().promise();
  if (!Layers) {
    return [];
  }
  const layers: Lambda.LayersListItem[] = [];
  Layers.forEach(layer => layers.push(layer));
  return layers;
}

export async function createLambda(
  FunctionName: string,
  Description: string,
  Runtime: Lambda.Runtime,
  Role: string,
  Handler: string,
  ZipFile: Lambda._Blob
) {
  const lambda = new Lambda();
  const params: Lambda.CreateFunctionRequest = {
    FunctionName,
    Description,
    Runtime,
    Role,
    Handler,
    Code: {
      ZipFile
    }
  };
  const result = await lambda.createFunction(params).promise();
}

export async function getLambdaLogs(lambdaName: string) {
  const logs = new CloudWatchLogs();
  const logGroupName = `/aws/lambda/${lambdaName}`;
  const { logStreams } = await logs
    .describeLogStreams({
      logGroupName,
      limit: 20
    })
    .promise();
  const final: any[] = [];
  if (logStreams) {
    const $$: Promise<CloudWatchLogs.OutputLogEvents>[] = [];
    logStreams.forEach(stream => {
      const name = stream.logStreamName || "UK";
      const logs = getLogs(logGroupName, name);
      $$.push(logs);
    });
    const yy = await Promise.all($$);
    yy.map((logs, i) => {
      final.push({
        stream: logStreams[i],
        logs
      });
    });
    return final;
  } else {
    return [];
  }

  async function getLogs(logGroupName: string, logStreamName: string) {
    const options: CloudWatchLogs.GetLogEventsRequest = {
      logGroupName,
      logStreamName,
      // endTime: "NUMBER_VALUE",
      limit: 20,
      // nextToken: "STRING_VALUE",
      startFromHead: true
      // startTime: "NUMBER_VALUE"
    };
    const result = await logs.getLogEvents(options).promise();
    return result.events || [];
  }
}
