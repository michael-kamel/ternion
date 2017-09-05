const Manager = require('../src/manager')
const EventEmitter = require('events')
const Emitter = require('../src/emitter')

describe('Manager tests', () =>
{
    describe('Construction Tests', () =>
    {
        test('fails if no event source provided', ()=>
        {
            expect(() => new Manager()).toThrow('No event source provided')
        })
        test('fails if no emitter provided', () =>
        {
            expect(() => new Manager('test')).toThrow('No emitter provided')
        })
        test('fails if emitter is not an event emitter or an emitter bridge', () =>
        {
            expect(() => new Manager('test', {})).toThrow('No emitter provided')
        })
        test('fails if no identifier provided', () =>
        {
            expect(() => new Manager('test', new EventEmitter())).toThrow('No identifier provided')
        })
        test('Passes if all params are valid', () =>
        {
            expect(() => new Manager('test', new EventEmitter(), 'test')).not.toThrow()
        })
    })
})