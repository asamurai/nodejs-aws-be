import {S3Event} from "aws-lambda";
import { S3 } from "aws-sdk";
import csv from "csv-parser";

const {
  IMPORT_BUCKET_NAME,
  COPY_PREFIX,
  IMPORT_FILE_PREFIX
} = process.env;

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const importFileParser = async (_event: S3Event) => {
  try {
    console.debug('File creation triggered event with params: \n', JSON.stringify(_event,null, 2));

    const s3 = new S3({ region: 'eu-west-1' });

    const streams = [];

    for (const record of _event.Records) {
      const { key } = record.s3.object;
      const stream = new Promise((resolve, reject) => {
        const s3Stream = s3.getObject({
          Bucket: IMPORT_BUCKET_NAME,
          Key: key
        }).createReadStream();

        s3Stream.pipe(csv())
          .on('open', () => console.debug(`Parsing file ${key}`))
          .on('data', data => console.debug('csv-parser data:', data))
          .on('error', async error => {
            console.log('Error:', error);
            await s3.deleteObject({
              Bucket: IMPORT_BUCKET_NAME,
              Key: key
            }).promise();

            reject(error)
          })
          .on('end', async () => {
            const newKey = key.replace(IMPORT_FILE_PREFIX, COPY_PREFIX);

            await s3.copyObject({
              Bucket: IMPORT_BUCKET_NAME,
              CopySource: `${IMPORT_BUCKET_NAME}/${key}`,
              Key: newKey
            }).promise();

            await s3.deleteObject({
              Bucket: IMPORT_BUCKET_NAME,
              Key: key
            }).promise();

            resolve(`${IMPORT_BUCKET_NAME}/${newKey}`);
          });
      });

      streams.push(stream)
    }

    const results = await Promise.all(streams);

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: 'Internal Server Error',
    };
  }
};

export default importFileParser;
