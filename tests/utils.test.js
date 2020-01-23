const utils = require("../src/lib/utils");

describe("utils Tests", () => {
  it("creates partial function", () => {
    const func = jest.fn().mockImplementation(() => {});
    const partial = utils.partial(func, 1, 2);
    partial(3, 4);
    expect(func).toHaveBeenCalledWith(1, 2, 3, 4);
  });

  it("async some seq full execution", async() => {
    const arr = [1, 2, 3];
    const predicate = jest.fn().mockImplementation(val => val === 4);
    await utils.asyncSomeSequential(arr, predicate);
    expect(predicate).toHaveBeenCalledTimes(3);
  });

  it("async some seq partial exection", async() => {
    const arr = [1, 2, 3, 4, 5];
    const predicate = jest.fn().mockImplementation(val => val === 4);
    await utils.asyncSomeSequential(arr, predicate);
    expect(predicate).toHaveBeenCalledTimes(4);
  });
});
