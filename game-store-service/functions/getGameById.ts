import { APIGatewayProxyHandler } from "aws-lambda";
import { invokeClient, closeClient } from './invokeClient';

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const getGameById: APIGatewayProxyHandler = async (_event, _context) => {
  let client;
  try {
    const {
      pathParameters: { id: gameId },
    } = _event;
    console.debug('Get product by id request with params: \n', JSON.stringify(_event.pathParameters,null, 2));

    if (!/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(gameId)) {
      return {
        statusCode: 400,
        headers,
        body: "Request param id is not valid",
      };
    }

    client = await invokeClient();
    const {rows: [foundItem]} = await client.query(
      'select p.*, s.count from products p join stocks s on s.product_id = p.id where p.id = $1',
      [gameId]
    );
    if (!foundItem) {
      return {
        statusCode: 404,
        headers,
        body: "Page not found",
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(foundItem),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: 'Internal Server Error',
    };
  } finally {
    closeClient(client);
  }
};

export default getGameById;
