import { APIGatewayProxyHandler } from "aws-lambda";
import {closeClient, invokeClient} from "./invokeClient";

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const createGameProduct: APIGatewayProxyHandler = async (_event, _context) => {
  let client;
  try {
    console.debug('Create product request with body: \n', JSON.stringify(_event.body,null, 2));
    const { title, studio, genre, description, release_date, poster, price, count } = JSON.parse(_event.body);

    client = await invokeClient();

    await client.query('BEGIN');
    const {
      rows: [insertedProduct],
    } = await client.query(
      'insert into products(title, studio, genre, description, release_date, poster, price) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, studio, genre, description, release_date, poster, price]
    );

    await client.query(
      'insert into stocks(product_id, count) values ($1, $2)',
      [insertedProduct['id'], count]
    );

    await client.query('COMMIT');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        result: 'Successfully created new product.'
      }),
    };
  } catch (error) {
    client && await client.query('ROLLBACK');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error }),
    };
  } finally {
    closeClient(client);
  }
};

export default createGameProduct;
