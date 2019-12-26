import * as AWS from "aws-sdk";
import { Runtime } from "aws-sdk/clients/lambda";
import { _Blob } from "aws-sdk/clients/apigateway";

const getAWS = function(profile: string, region?: string) {
  var credentials = new AWS.SharedIniFileCredentials({
    profile
  });
  AWS.config.credentials = credentials;
  if (region) {
    AWS.config.region = region;
  }

  return AWS;
};

export async function getLambdas() {
  const awsLambda = getAWS("default", "ap-south-1").Lambda;
  const lambda = new awsLambda();
  const { NextMarker, Functions } = await lambda.listFunctions().promise();
  if (!Functions) {
    return [];
  }
  const functions: AWS.Lambda.FunctionConfiguration[] = [];
  Functions.forEach(fn => functions.push(fn));
  return functions;
}

export async function getLayers() {
  const awsLambda = getAWS("default", "ap-south-1").Lambda;
  const lambda = new awsLambda();
  const { NextMarker, Layers } = await lambda.listLayers().promise();
  if (!Layers) {
    return [];
  }
  const layers: AWS.Lambda.LayersListItem[] = [];
  Layers.forEach(layer => layers.push(layer));
  return layers;
}

export async function createLambda(
  FunctionName: string,
  Description: string,
  Runtime: Runtime,
  Role: string,
  Handler: string,
  ZipFile: _Blob
) {
  const awsLambda = getAWS("default", "ap-south-1").Lambda;
  const lambda = new awsLambda();
  const params: AWS.Lambda.CreateFunctionRequest = {
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
  const awsLogs = getAWS("default", "ap-south-1").CloudWatchLogs;
  const logs = new awsLogs();
  const logGroupName = `/aws/lambda/${lambdaName}`;
  const { logStreams } = await logs
    .describeLogStreams({
      logGroupName,
      limit: 20
    })
    .promise();
  // let obj: { [key: string]: AWS.CloudWatchLogs.LogStream } = {};
  const final: any[] = [];
  if (logStreams) {
    console.log("HH");
    const $$: Promise<AWS.CloudWatchLogs.OutputLogEvents>[] = [];
    logStreams.forEach(stream => {
      const name = stream.logStreamName || "UK";
      const logs = getLogs(logGroupName, name);
      $$.push(logs);
      // obj[name] = stream;
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
    const options: AWS.CloudWatchLogs.GetLogEventsRequest = {
      logGroupName,
      logStreamName,
      // endTime: "NUMBER_VALUE",
      limit: 20,
      // nextToken: "STRING_VALUE",
      startFromHead: true
      // startTime: "NUMBER_VALUE"
    };
    // logs.listTagsLogGroup()
    const result = await logs.getLogEvents(options).promise();

    // console.log(result);
    return result.events || [];
  }
}
