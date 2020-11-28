import catalogBatchProcess from "../functions/catalogBatchProcess";

jest.mock("aws-sdk", () => ({
  SNS: class SNS {
    constructor() {
      return {
        publish: () => ({
          promise: () => {},
        }),
      };
    }
  },
}));

jest.mock("../functions/invokeClient", () => ({
  invokeClient: () => ({
    query: () => ({
      rows: [{ id: 'id' }]
    })
  }),
  closeClient: () => {}
}));

const validProduct = {
  count: 1,
  description: "Description",
  price: 10,
  title: "Game title",
  src: "game poster url",
};

describe("#catalogBatchProcess", () => {
  it("should generate error message if product is not valid", async () => {
    const invalidProduct = { ...validProduct, price: "Too expensive" };
    const consoleErrorSpy = jest.spyOn(console, "error");

    await catalogBatchProcess({
      Records: [{ body: JSON.stringify(invalidProduct) }],
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "DB error: ",
      `Product ${invalidProduct.title} is not valid`
    );
  });

  it("should generate success message if product is valid", async () => {
    const consoleDebugSpy = jest.spyOn(console, "debug");

    await catalogBatchProcess({
      Records: [{ body: JSON.stringify(validProduct) }],
    });

    expect(consoleDebugSpy).toHaveBeenCalledWith(
      `Product ${validProduct.title} has been created`
    );
  });
});
