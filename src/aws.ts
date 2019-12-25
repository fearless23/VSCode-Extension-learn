import * as AWS from "aws-sdk";

const getAwsLambda = function(profile: string, region?: string) {
  var credentials = new AWS.SharedIniFileCredentials({
    profile
  });
  AWS.config.credentials = credentials;
  if (region) {
    AWS.config.region = region;
  }

  return AWS.Lambda;
};

export async function getLambdas() {
  const awsLambda = getAwsLambda("default", "ap-south-1");
  const lambda = new awsLambda();
  const { NextMarker, Functions } = await lambda.listFunctions().promise();
  if (!Functions) {
    return [];
  }
  return Functions;
}

// export async function getLambda(FunctionName:string) {
//   const awsLambda = getAwsLambda("default", "ap-south-1");
//   const lambda = new awsLambda();
//   const result = await lambda.getFunction({FunctionName}).promise()
//   return result.$response.
// }
