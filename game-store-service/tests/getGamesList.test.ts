import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import getGamesList from "../functions/getGamesList";

it("return game list", async () => {
  const event = {} as APIGatewayProxyEvent;
  const context = {} as Context;
  const callback = jest.fn();

  const result = await getGamesList(event, context, callback);

  expect(result).toBeDefined();
  expect(JSON.parse((result as APIGatewayProxyResult).body).length).toEqual(3);
});
