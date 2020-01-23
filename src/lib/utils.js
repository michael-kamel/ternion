async function asyncSomeSequential(arr, func) {
  for (const i in arr) {
    const result = await func(arr[i]);
    if (result) {
      break;
    }
  }
}

function asyncSomeConcurrent(arr, func) {
  return new Promise((resolve, reject) => {
    Promise.all(
      arr.map(element =>
        Promise.resolve(func(arr[element])).then(val => val && resolve())
      )
    ).then(resolve);
  });
}

function partial(func, ...args) {
  return function(...rest) {
    return func.call(this, ...args, ...rest);
  };
}

module.exports = {
  asyncSomeSequential,
  asyncSomeConcurrent,
  partial
};
