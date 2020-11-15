import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const getThumbnailsList: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    console.debug('Get files list request with event params: \n', JSON.stringify(_event,null, 2));

    const s3 = new S3({ region: 'eu-west-1' });
    const params = {
      Bucket: process.env.THUMBNAILS_BUCKET,
      Prefix: 'thumbnails/'
    };
    const s3Response = await s3.listObjectsV2(params).promise();
    const thumbnails = s3Response.Contents;
    const thumbnailsLinks = thumbnails.map((thumbnail) =>
      `https://${process.env.THUMBNAILS_BUCKET}.s3.amazonaws.com/${thumbnail.Key}`
    );
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(thumbnailsLinks),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: 'Internal Server Error',
    };
  }
};

export default getThumbnailsList;
