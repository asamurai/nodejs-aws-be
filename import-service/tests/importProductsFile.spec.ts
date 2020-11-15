import {
  APIGatewayProxyResult,
  Context
} from "aws-lambda";
import importProductsFile from "../functions/importProductsFile";

export const addCorsHeaders = (response: APIGatewayProxyResult) => ({
  ...response,
  headers: {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    ...(response.headers || {}),
  },
});

const signedUrl = "https://bucket.eu-west-1.amazonaws.com/uploaded";

jest.mock("aws-sdk", () => ({
  S3: class S3 {
    constructor() {
      return {
        getSignedUrlPromise: () => signedUrl,
      };
    }
  },
}));

describe("#importProductsFile", () => {
  const eventContext = {} as Context;
  it("should return correct response with signed url", async () => {
    const response = await importProductsFile({
      queryStringParameters: {name: "test.csv"}
    } as any, eventContext, () => {});

    expect(response).toMatchObject(
      addCorsHeaders({
        statusCode: 200,
        body: signedUrl
      })
    );
  });

  it("should return status 400 if file name is empty", async () => {
    const response = await importProductsFile({
      queryStringParameters: { name: "" },
    } as any, eventContext, () => {});

    expect(response).toMatchObject(
      addCorsHeaders({ statusCode: 400 } as APIGatewayProxyResult)
    );
  });

  it("should return status 500 if something went wrong", async () => {
    const response = await importProductsFile({} as any, eventContext, () => {});

    expect(response).toMatchObject(
      addCorsHeaders({ statusCode: 500 } as APIGatewayProxyResult)
    );
  });
});
