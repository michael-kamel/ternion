async function asyncSome (arr, func) {
  for (const i in arr) {
    const result = await func(arr[i])
    if (result) { break }
  }
}
function partial (func, ...args) {
  return function (...rest) {
    return func.call(this, ...args, ...rest)
  }
}
module.exports =
{
  asyncSome,
  partial
}
