import * as path from "path";
import { readFileSync } from "fs";
import { APIGatewayProxyHandler } from "aws-lambda";
import { GameList } from "../types";
import { delay } from "../delay";

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const getAllGamesFromMock = (): GameList =>
  JSON.parse(
    readFileSync(path.join(__dirname, "data", "games.json"), "utf-8")
  );

const getGamesList: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    const games = await delay<GameList>(() => getAllGamesFromMock(), 150);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(games),
    };
  } catch (error) {
    throw Error("[500] Internal Server Error");
  }
};

export default getGamesList;
