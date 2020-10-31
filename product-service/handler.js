'use strict';
const games = require('./mocks/games');

const getGameById = async event => {
  try {
    const { id } = event.pathParameters;
    if (!id) {
      console.error('Id parameter is required. Event\n', JSON.stringify({ event }));
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Id parameter is required.'
        })
      }
    }
    const game = games.find((game) => game.id === id);
    if (!game) {
      console.error('No game with id ' + id + '. Event\n', JSON.stringify({ event }));
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'No game with id ' + id
        })
      }
    }
    console.debug('Game with id ' + id + ' successfully returned. Event\n', JSON.stringify({ event }));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Game with id ' + id + ' successfully fetched',
        game
      })
    };
  } catch (error) {
    console.error('Error during fetching game by id with event ', JSON.stringify({ event }), ' : \n', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message
      })
    }
  }
};

const getGamesList = (event) => {
  try {
    console.debug('Trying to return list of games!');
    return {
      body: JSON.stringify({
        statusCode: 200,
        games
      })
    };
  } catch (error) {
    console.error('Error during fetching games list with event ', JSON.stringify({ event }), ' : \n', error);
    return {
      body: JSON.stringify({
        statusCode: 500,
        message: error.message
      })
    }
  }
};


module.exports.getGameById = getGameById;
module.exports.getGamesList = getGamesList;
