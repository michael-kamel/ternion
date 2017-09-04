const Handling = require('../src/handler')
const EventHandler = require('../src/lib/eventHandler')

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
            build.patch({tool1:1, tool2:2})
            expect(build.getTools()).toMatchObject({tool1:1, tool2:2})
        })
        test('patches extra tools', () =>
        {
            const build = new Handling.HandlerBuild()
            build.patch({tool1:1, tool2:2})
            build.patch({tool3:3, tool4:4})
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
    })
})