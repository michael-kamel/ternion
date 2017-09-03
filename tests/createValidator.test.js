const createValidator = require('../src/lib/validator')

describe('Validator Creation', () =>
{
    test('has message', () =>
    {
        const validator = createValidator(() => true, 'test')
        expect(validator.msg).toBeDefined()
        expect(validator.msg).toBe('test')
    })
    test('returns function', () =>
    {
        expect(typeof createValidator(() => true, 'test')).toBe('function')
    })
    test('calls validator', ()=>
    {
        const predicate = jest.fn().mockImplementation(() => {})
        const validator = createValidator(predicate, 'test')
        validator(1, 2, 3)
        expect(predicate).toHaveBeenCalledWith(1, 2, 3)
    })
})