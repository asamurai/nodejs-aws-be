import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerHandler,
} from "aws-lambda";

const BASIC_SCHEME = "Basic";

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (
  event,
  _context,
  callback
) => {
  if (event["type"] !== "TOKEN") {
    callback("Unauthorized");
    return;
  }

  try {
    const { authorizationToken, methodArn } = event;
    const [authScheme, encodedCreds] = authorizationToken.split(" ");

    if (authScheme !== BASIC_SCHEME || !encodedCreds) {
      callback("Unauthorized");
      return;
    }

    const [userName, password] = Buffer.from(encodedCreds, "base64")
      .toString("utf-8")
      .split(":");
    const validUserPassword = process.env[userName];
    const effect =
      validUserPassword && validUserPassword === password ? "Allow" : "Deny";
    const policy = generatePolicy(encodedCreds, methodArn, effect);

    callback(null, policy);
  } catch (error) {
    console.log("Error:", error);
    callback("Unauthorized");
  }
};

const generatePolicy = (
  principalId,
  resource,
  effect = "Deny"
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      }
    ],
  },
});

export default basicAuthorizer;
