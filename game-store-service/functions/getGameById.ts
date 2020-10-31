import { APIGatewayProxyHandler } from "aws-lambda";
import { readFileSync } from "fs";
import * as path from "path";
import { GameList, Game } from "../types";
import { delay } from "../delay";

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const gamesList: GameList = JSON.parse(
  readFileSync(path.join(__dirname, "data", "games.json"), "utf-8")
);

const getGameById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const {
      pathParameters: { id },
    } = event;

    const game = await delay<Game>(
      () => gamesList.find((game) => game.id === id),
      150
    );

    if (game) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(game),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: "Page not found",
    };
  } catch (error) {
    throw Error("[500] Internal Server Error");
  }
};

export default getGameById;
