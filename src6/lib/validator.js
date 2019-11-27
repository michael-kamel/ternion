function createValidator(predicate, msg) {
  const validator = function (...args) {
    return predicate.call(predicate, ...args);
  };
  validator.msg = msg;
  return validator;
}
module.exports = createValidator;