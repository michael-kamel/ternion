async function asyncSomeSequential(arr, func) {
  for (const i in arr) {
    const result = await func(arr[i]);
    if (result) {
      break;
    }
  }
}

function asyncSomeConcurrent(arr, func) {
  return Promise.race(arr.map(element => func(arr[element])));
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
