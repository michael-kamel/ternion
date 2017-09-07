function createValidator(predicate, msg) {
    let validator = function (...args) {
        return predicate.call(predicate, ...args);
    };
    validator.msg = msg;
    return validator;
}
module.exports = createValidator;