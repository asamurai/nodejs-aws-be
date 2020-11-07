import { APIGatewayProxyHandler } from "aws-lambda";
import { invokeClient, closeClient } from './invokeClient';

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const getGameById: APIGatewayProxyHandler = async (event, _context) => {
  let client;
  try {
    const {
      pathParameters: { id: gameId },
    } = event;

    client = await invokeClient();
    const {rows} = await client.query(`SELECT * FROM products WHERE id=$1`, [gameId]);
    const [product] = rows.length ? rows : null;
    if (!product) {
      return {
        statusCode: 404,
        headers,
        body: "Page not found",
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(product),
      };
    }
  } catch (error) {
    throw Error("[500] Internal Server Error");
  } finally {
    closeClient(client);
  }
};

export default getGameById;
