import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const {
  IMPORT_BUCKET_NAME,
  IMPORT_FILE_PREFIX,
  SIGNED_URL_EXPIRATION
} = process.env;

const importProductsFile: APIGatewayProxyHandler = async (_event) => {
  try {
    console.debug('Get import product files request with event params: \n', JSON.stringify(_event,null, 2));

    const { queryStringParameters: { name } } = _event;

    if (!name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify('File name should exist'),
      };
    }

    const filePath = `${IMPORT_FILE_PREFIX}/${name}`;

    const s3 = new S3({
      region: 'eu-west-1',
      signatureVersion: 'v4'
    });

    const params = {
      Bucket: IMPORT_BUCKET_NAME,
      Key: filePath,
      Expires: +SIGNED_URL_EXPIRATION,
      ContentType: 'text/csv'
    };
    console.debug('Params for preSigned error: \n', JSON.stringify(params));

    const url = await s3.getSignedUrlPromise('putObject', params);

    console.debug('url created: \n', url);
    return {
      statusCode: 200,
      headers,
      body: url,
    };
  } catch (error) {
    console.error('Error: ', error);
    return {
      statusCode: 500,
      headers,
      body: 'Internal Server Error',
    };
  }
};

export default importProductsFile;
