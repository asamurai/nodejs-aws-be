import { S3Event } from "aws-lambda";

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const basicAuthorizer = async (_event: S3Event) => {
  try {
    console.debug('Authorization lambda triggered with params: \n', JSON.stringify(_event,null, 2));

    return {
      statusCode: 200,
      body: 'Authorization result'
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: 'Internal Server Error',
    };
  }
};

export default basicAuthorizer;
