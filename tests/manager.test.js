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
    describe('Method Tests', () =>
    {
        test('Should return on non existing message', () =>
        {
            const mocke = jest.fn()
            const mockb = jest.fn()
            const eventSource = {
                sockets:{
                    connected:{
                        'test': {
                            broadcast:{emit:mockb},
                            emit:mocke
                        }
                    }
                }
            }
            const emitter = new EventEmitter
            const identifier = 'test'
            const manager = new Manager(eventSource, emitter, identifier)
            const data = undefined
            emitter.on = (dat, func) => func(data)
            manager._listen()
            expect(mocke).not.toHaveBeenCalled()
            expect(mockb).not.toHaveBeenCalled()
        })
        test('Should return on no msgtype', () =>
        {
            const mocke = jest.fn()
            const mockb = jest.fn()
            const eventSource = {
                sockets:{
                    connected:{
                        'test': {
                            broadcast:{emit:mockb},
                            emit:mocke
                        }
                    }
                }
            }
            const emitter = new EventEmitter
            const identifier = 'test'
            const manager = new Manager(eventSource, emitter, identifier)
            const data = {}
            emitter.on = (dat, func) => func(data)
            manager._listen()
            expect(mocke).not.toHaveBeenCalled()
            expect(mockb).not.toHaveBeenCalled()
        })
        test('Should return on no msgdata', () =>
        {
            const mocke = jest.fn()
            const mockb = jest.fn()
            const eventSource = {
                sockets:{
                    connected:{
                        'test': {
                            broadcast:{emit:mockb},
                            emit:mocke
                        }
                    }
                }
            }
            const emitter = new EventEmitter
            const identifier = 'test'
            const manager = new Manager(eventSource, emitter, identifier)
            const data = {msgType:'t'}
            emitter.on = (dat, func) => func(data)
            manager._listen()
            expect(mocke).not.toHaveBeenCalled()
            expect(mockb).not.toHaveBeenCalled()
        })
        test('Should return on no msgdata', () =>
        {
            const mocke = jest.fn()
            const mockb = jest.fn()
            const eventSource = {
                sockets:{
                    connected:{
                        'test': {
                            broadcast:{emit:mockb},
                            emit:mocke
                        }
                    }
                }
            }
            const emitter = new EventEmitter
            const identifier = 'test'
            const manager = new Manager(eventSource, emitter, identifier)
            const data = {msgType:'t', msgData:'d'}
            emitter.on = (dat, func) => func(data)
            manager._listen()
            expect(mocke).not.toHaveBeenCalled()
            expect(mockb).not.toHaveBeenCalled()
        })
        test('Should broadcast', () =>
        {
            const mock = jest.fn()
            const eventSource = {
                sockets:{
                    connected:{
                        'test': {
                            broadcast:{emit:mock},
                        }
                    }
                }
            }
            const emitter = new EventEmitter
            const identifier = 'test'
            const manager = new Manager(eventSource, emitter, identifier)
            const data = {msgType:'t', msgData:'d', broadcast:true, ids:['test']}
            emitter.on = (dat, func) => func(data)
            manager._listen()
            expect(mock).toHaveBeenCalledTimes(1)
        })
        test('Should respond to some', () =>
        {
            const mock1 = jest.fn()
            const mock2 = jest.fn()
            const mock3 = jest.fn()
            const eventSource = {
                sockets:{
                    connected:{
                        'test1': {
                            emit:mock1,
                        },
                        'test2': {
                            emit:mock2,
                        },
                        'test3': {
                            emit:mock3,
                        }
                    }
                }
            }
            const emitter = new EventEmitter
            const identifier = 'test'
            const manager = new Manager(eventSource, emitter, identifier)
            const data = {msgType:'t', msgData:'d', ids:['test1', 'test2']}
            emitter.on = (dat, func) => func(data)
            manager._listen()
            expect(mock1).toHaveBeenCalledTimes(1)
            expect(mock2).toHaveBeenCalledTimes(1)
            expect(mock3).not.toHaveBeenCalled()
        })
    })
})