let asyncSome = (() => {
  var _ref = _asyncToGenerator(function* (arr, func) {
    for (const i in arr) {
      const result = yield func(arr[i]);
      if (result) {
        break;
      }
    }
  });

  return function asyncSome(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function partial(func, ...args) {
  return function (...rest) {
    return func.call(this, ...args, ...rest);
  };
}
module.exports = {
  asyncSome,
  partial
};