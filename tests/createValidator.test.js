const createValidator = require('../src6/lib/validator');

describe('Validator Creation', () => {
  test('has message', () => {
    const validator = createValidator(() => true, 'test');
    expect(validator.msg).toBeDefined();
    expect(validator.msg).toBe('test');
  });
  test('has error', () => {
    const validator = createValidator(() => true, new Error());
    expect(validator.msg).toBeDefined();
    expect(validator.msg).toBeInstanceOf(Error);
  });
  test('returns function', () => {
    expect(createValidator(() => true, 'test')).toBeInstanceOf(Function);
  });
  test('calls validator', () => {
    const predicate = jest.fn().mockImplementation(() => {});
    const validator = createValidator(predicate, 'test');
    validator(1, 2, 3);
    expect(predicate).toHaveBeenCalledWith(1, 2, 3);
  });
});
