import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import getGameById from "../functions/getGameById";

it("return game by id", async () => {
  const event = ({
    pathParameters: { id: "1" },
  } as unknown) as APIGatewayProxyEvent;

  const context = {} as Context;
  const callback = jest.fn();

  const result = await getGameById(event, context, callback);

  expect(result).toBeDefined();
  expect(JSON.parse((result as APIGatewayProxyResult).body)).toEqual({
    "id": "1",
    "title": "Witcher 1",
    "studio": "CD Projekt Red",
    "platforms": ["Windows"],
    "genre": "RPG",
    "description": "Description for Witcher 1",
    "release_date": "2007-01-01",
    "poster": "https://m.media-amazon.com/images/M/MV5BMTBlMDk3MDktZTFkZC00YjkzLTkwMWUtYmRlNjYwMzJmNzRmXkEyXkFqcGdeQXVyOTQxNzM2MjY@._V1_UY1200_CR108,0,630,1200_AL_.jpg",
    "price": 300,
    "count": 16
  });
});
