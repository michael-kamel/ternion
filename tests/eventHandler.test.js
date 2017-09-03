const EventHandler = require('../src/lib/eventHandler')

describe('Event Handler Tests', () =>
{
    describe('Registration', () =>
    {
        test('can register prevalidator for event', () =>
        {
            const handler = new EventHandler()
            handler.registerPreValidator('ev1', () => {})
            expect(handler._events.ev1).toBeDefined()
            expect(handler._events.ev1.preValidators).toBeDefined()
            expect(handler._events.ev1.preValidators).toHaveLength(1)
        })
        test('can register prevalidator for existing event', () =>
        {
            const handler = new EventHandler()
            handler.registerPreValidator('ev1', () => {})
            handler.registerPreValidator('ev1', () => {})
            expect(handler._events.ev1).toBeDefined()
            expect(handler._events.ev1.preValidators).toBeDefined()
            expect(handler._events.ev1.preValidators).toHaveLength(2)
        })

        test('can register postvalidator for event', () =>
        {
            const handler = new EventHandler()
            handler.registerPostValidator('ev1', () => {})
            expect(handler._events.ev1).toBeDefined()
            expect(handler._events.ev1.postValidators).toBeDefined()
            expect(handler._events.ev1.postValidators).toHaveLength(1)
        })
        test('can register postvalidator for existing event', () =>
        {
            const handler = new EventHandler()
            handler.registerPostValidator('ev1', () => {})
            handler.registerPostValidator('ev1', () => {})
            expect(handler._events.ev1).toBeDefined()
            expect(handler._events.ev1.postValidators).toBeDefined()
            expect(handler._events.ev1.postValidators).toHaveLength(2)
        })

        test('can register middleware for event', () =>
        {
            const handler = new EventHandler()
            handler.registerMiddleware('ev1', () => {})
            expect(handler._events.ev1).toBeDefined()
            expect(handler._events.ev1.middlewares).toBeDefined()
            expect(handler._events.ev1.middlewares).toHaveLength(1)
        })
        test('can register middleware for existing event', () =>
        {
            const handler = new EventHandler()
            handler.registerMiddleware('ev1', () => {})
            handler.registerMiddleware('ev1', () => {})
            expect(handler._events.ev1).toBeDefined()
            expect(handler._events.ev1.middlewares).toBeDefined()
            expect(handler._events.ev1.middlewares).toHaveLength(2)
        })

        test('can register handler for event', () =>
        {
            const handler = new EventHandler()
            handler.registerHandler('ev1', () => {})
            expect(handler._events.ev1).toBeDefined()
            expect(handler._events.ev1.handlers).toBeDefined()
            expect(handler._events.ev1.handlers).toHaveLength(1)
        })
        test('can register handler for existing event', () =>
        {
            const handler = new EventHandler()
            handler.registerHandler('ev1', () => {})
            handler.registerHandler('ev1', () => {})
            expect(handler._events.ev1).toBeDefined()
            expect(handler._events.ev1.handlers).toBeDefined()
            expect(handler._events.ev1.handlers).toHaveLength(2)
        })
    })

    describe('Prop Settings', () =>
    {
        test('sets opts', () =>
        {
            const handler = new EventHandler()
            const opts = {preFailFast:false, postFailFast:false, unknownActionMsg:'test'}
            handler.setOpts(opts)
            expect(handler._opts).toEqual(opts)
        })
        test('sets error handler', () =>
        {
            const handler = new EventHandler()
            const errorHandler = () => {}
            handler.setErrorHandler(errorHandler)
            expect(handler._errorHandler).toEqual(errorHandler)
        }) 
    })
})