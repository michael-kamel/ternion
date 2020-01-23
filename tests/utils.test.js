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

  it("async some seq partial execution", async() => {
    const arr = [1, 2, 3, 4, 5];
    const predicate = jest.fn().mockImplementation(val => val === 4);
    await utils.asyncSomeSequential(arr, predicate);
    expect(predicate).toHaveBeenCalledTimes(4);
  });

  it("async some conc full execution", async() => {
    const arr = [1, 2, 3];
    const predicate = jest.fn().mockImplementation(val => val === 4);
    await utils.asyncSomeConcurrent(arr, predicate);
    expect(predicate).toHaveBeenCalledTimes(3);
  });

  it("async some conc partial execution", async() => {
    let finishedCount = 0;
    const arr = [...Array(100).keys()];

    const predicate = jest.fn().mockImplementation(element => {
      return new Promise((resolve, reject) => {
        setTimeout(
          () => {
            resolve(element === 4);
            finishedCount++;
          },
          element === 4 ? 0 : 10000000
        );
      });
    });

    await utils.asyncSomeConcurrent(arr, predicate);
    expect(finishedCount).toBe(1);
  });

  it("async some conc execution honors all", async() => {
    const arr = [...Array(100).keys()];

    const predicate = jest.fn().mockImplementation(element => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(false);
        }, 100);
      });
    });

    await utils.asyncSomeConcurrent(arr, predicate);
    expect(predicate).toHaveBeenCalledTimes(100);
  });
});
