const utils = require('../src/lib/utils')

describe('Utils Tests', () =>
{
    test('creates partial function', () =>
    {
        const func = jest.fn().mockImplementation(() => {})
        const partial = utils.partial(func, 1 , 2)
        partial(3, 4)
        expect(func).toHaveBeenCalledWith(1, 2, 3, 4)
    })
    test('async some full exection', async () =>
    {
        const arr = [1, 2, 3]
        const predicate = jest.fn().mockImplementation(val => val === 4)
        await utils.asyncSome(arr, predicate)
        expect(predicate).toHaveBeenCalledTimes(3)
    })
    test('async some partial exection', async () =>
    {
        const arr = [1, 2, 3, 4, 5]
        const predicate = jest.fn().mockImplementation(val => val === 4)
        await utils.asyncSome(arr, predicate)
        expect(predicate).toHaveBeenCalledTimes(4)
    })
})