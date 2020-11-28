import "source-map-support/register";
import getProductsList from "./functions/getGamesList";
import getProductsById from "./functions/getGameById";
import createProduct from "./functions/createGameProduct";
import catalogBatchProcess from "./functions/catalogBatchProcess";

export {
  getProductsList,
  getProductsById,
  createProduct,
  catalogBatchProcess
};
