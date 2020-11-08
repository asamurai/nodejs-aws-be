import { APIGatewayProxyHandler } from "aws-lambda";
import {closeClient, invokeClient} from "./invokeClient";

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const getGamesList: APIGatewayProxyHandler = async (_event, _context) => {
  let client;
  try {
    console.debug('Get products request with event params: \n', JSON.stringify(_event,null, 2));

    client = await invokeClient();
    const {rows: products} = await client.query(
      'select p.*, s.count from products p join stocks s on s.product_id = p.id'
    );
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error }),
    };
  } finally {
    closeClient(client);
  }
};

export default getGamesList;
