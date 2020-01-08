const createValidator = require('../src/lib/validator');

describe('validator Creation', () => {
  it('has message', () => {
    const validator = createValidator(() => true, 'test');
    expect(validator.msg).toBeDefined();
    expect(validator.msg).toBe('test');
  });

  it('has error', () => {
    const validator = createValidator(() => true, new Error());
    expect(validator.msg).toBeDefined();
    expect(validator.msg).toBeInstanceOf(Error);
  });

  it('returns function', () => {
    expect(createValidator(() => true, 'test')).toBeInstanceOf(Function);
  });

  it('calls validator', () => {
    const predicate = jest.fn().mockImplementation(() => {});
    const validator = createValidator(predicate, 'test');
    validator(1, 2, 3);
    expect(predicate).toHaveBeenCalledWith(1, 2, 3);
  });
});
