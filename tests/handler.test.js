const Handling = require('../src6/handler')
const EventHandler = require('../src6/lib/eventHandler')

describe('Handling tests', () =>
{
    describe('Building tests', () =>
    {
        test('create build', () =>
        {
            const build = new Handling.HandlerBuild()
            expect(build).toBeInstanceOf(Handling.HandlerBuild)
        })
        test('set handler fails if param is not an eventhandler', () =>
        {
            const build = new Handling.HandlerBuild()
            expect(() => build.setHandler({})).toThrow()
        })
        test('gets handler', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.setHandler(eventHandler)
            expect(build.getHandler()).toBe(eventHandler)
        })
        test('patches tools', () =>
        {
            const build = new Handling.HandlerBuild()
            build.patchTools({tool1:1, tool2:2})
            expect(build.getTools()).toMatchObject({tool1:1, tool2:2})
        })
        test('patches extra tools', () =>
        {
            const build = new Handling.HandlerBuild()
            build.patchTools({tool1:1, tool2:2})
            build.patchTools({tool3:3, tool4:4})
            expect(build.getTools()).toMatchObject({tool1:1, tool2:2, tool3:3, tool4:4})
        })
    })
    describe('Handler tests', () =>
    {
        test('constructor fails if no build defined', () =>
        {
            expect(() => new Handling.Handler(null, null, null)).toThrow('No build provided')
        })
        test('constructor fails if no valid build defined', () =>
        {
            expect(() => new Handling.Handler(1, null, null)).toThrow('No build provided')
        })
        test('constructor fails if build does not contain an event handler', () =>
        {
            const build = new Handling.HandlerBuild()
            expect(() => new Handling.Handler(build, null, null)).toThrow('Build is incomplete. A handler must be specified')
        })
        test('constructor fails if no emitter provided', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.setHandler(eventHandler)
            expect(() => new Handling.Handler(build, null, null)).toThrow('No emitter provided')
        })
        test('constructor fails if no emitter provided', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.setHandler(eventHandler)
            expect(() => new Handling.Handler(build, {}, null)).toThrow('No identifier provided')
        })
        test('starts once', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.setHandler(eventHandler)
            const handler = new Handling.Handler(build, {}, 'test')
            handler._started = true
            expect(() => handler.start()).toThrow()
        })
        test('patches tools', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.patchTools({tool1:'tool1', tool2:'tool2'})
            build.setHandler(eventHandler)
            const handler = new Handling.Handler(build, {}, 'test')
            let patched = handler.__patchTools('data', 1)
            expect(patched).toMatchObject({data:'data', senderId:1})
            expect(patched).toHaveProperty('tool1')
            expect(patched).toHaveProperty('tool2')
        })
        test('calls handler on receive', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.setHandler(eventHandler)
            const handler = new Handling.Handler(build, {}, 'test')
            const mockFn = jest.fn()
            handler._eventHandler.handle = mockFn
            handler._receive({eventType:'tev', senderId:1, data:'data'})
            expect(mockFn).toHaveBeenCalledWith('tev', 'data', {data:'data', senderId:1}, 1)
        })
        test('call emitter', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.setHandler(eventHandler)
            const mockFn = jest.fn()
            const handler = new Handling.Handler(build, {on:mockFn}, 'test')
            handler.start()
            expect(mockFn).toHaveBeenCalledTimes(1)
        })
        test('call emitter on new source', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.setHandler(eventHandler)
            const mockFn = jest.fn()
            const handler = new Handling.Handler(build, {on:mockFn}, 'test')
            handler.addSource('test2')
            expect(mockFn).toHaveBeenCalledTimes(1)
        })
        test('handles empty data', () =>
        {
            const eventHandler = new EventHandler()
            const build = new Handling.HandlerBuild()
            build.setHandler(eventHandler)
            const handler = new Handling.Handler(build, {}, 'test')
            const mockFn = jest.fn()
            handler._eventHandler.handle = mockFn
            handler._receive({eventType:'tev', senderId:1})
            expect(mockFn).toHaveBeenCalledWith('tev', {}, {data:{}, senderId:1}, 1)
        })
    })
})