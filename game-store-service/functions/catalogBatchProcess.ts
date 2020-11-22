import { SNS } from "aws-sdk";
import {closeClient, invokeClient} from "./invokeClient";

const { SNS_ARN } = process.env;

type ProductCreationStatus = "SUCCESS" | "FAILURE";

const catalogBatchProcess = async event => {
  let client;
  try {
    client = await invokeClient();
    const products = event.Records.map(({ body }) => JSON.parse(body));

    await Promise.all(
      products.map(async (product) => {
        let status: ProductCreationStatus = "SUCCESS";

        try {
          await addProductToDB(client, product);
        } catch (error) {
          status = "FAILURE";
          console.error("DB error: ", error?.message);
        }

        try {
          await publishMessageToSNS(product, status);
        } catch (error) {
          console.error("SNS error: \n", JSON.stringify(error));
        }
      })
    );
  } catch (error) {
    console.error("Error during catalogBatchProcess: \n", JSON.stringify(error));
  } finally {
    closeClient(client);
  }
};

const publishMessageToSNS = ({ title }, status: ProductCreationStatus) => {
  const sns = new SNS();

  return sns
    .publish({
      Subject: "Product creation result",
      Message:
        status === "SUCCESS"
          ? `The following product has been added to product DB:\n${title}`
          : `The following product has not been added to product DB:\n${title}`,
      TopicArn: SNS_ARN,
      MessageAttributes: {
        status: {
          DataType: "String",
          StringValue: status,
        },
      },
    })
    .promise();
};

const addProductToDB = async (client, product) => {
  const { title, studio, genre, description, release_date, poster, price, count } = formatProduct(product);

  if (!isProductValid({ title, price, count })) {
    throw new Error(`Product ${title} is not valid`);
  }

  const {
    rows: [{ id }],
  } = await client.query(
    'insert into products(title, studio, genre, description, release_date, poster, price) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [title, studio, genre, description, release_date, poster, price]
  );
  await client.query(
    'insert into stocks(product_id, count) values ($1, $2)',
    [id, count]
  );

  console.debug(`Product ${title} has been created`);
};

const formatProduct = ({
  title,
  price,
  count,
  description = "",
  src = "",
  studio = "",
  genre = "",
  release_date = "",
  poster = ""
}) => ({
  title,
  price: parseInt(price, 10),
  count: parseInt(count, 10),
  description,
  src,
  studio,
  genre,
  release_date,
  poster
});

const isProductValid = ({ title, price, count }) =>
  title &&
  count >= 0 &&
  Number.isInteger(count) &&
  price >= 0 &&
  Number.isInteger(price);

export default catalogBatchProcess;
