const Manager = require('../src6/manager')
const EventEmitter = require('events')
const Emitter = require('../src6/emitter')

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
    describe('Listen Tests', () =>
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
        test('Should disconnect', () =>
        {
            const mock = jest.fn()
            const eventSource = {
                sockets:{
                    connected:{
                        'test1': {
                            disconnect:mock
                        }
                    }
                }
            }
            const emitter = new EventEmitter
            const identifier = 'test'
            const manager = new Manager(eventSource, emitter, identifier)
            const data = {ids:['test1', 'test2'], disconnect:true, msgType:'disconnect', msgData:{}}
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
    describe('Namespacing tests', () =>
    {
        test('fails if no namespacing supported', () =>
        {
            const mock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._eventSource.of = undefined
            manager._setupConnection = mock
            expect(() => manager.addNamespace('test')).toThrow('The provided event source does not support namespacing')
            expect(mock).not.toHaveBeenCalled()
        })
        test('fails if no namespace provided', () =>
        {
            const mock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._eventSource = {of:{}}
            manager._setupConnection = mock
            expect(() => manager.addNamespace()).toThrow('Invalid namespace')
            expect(mock).not.toHaveBeenCalled()
        })
        test('fails if namespace is not a string', () =>
        {
            const mock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._eventSource = {of:{}}
            manager._setupConnection = mock
            expect(() => manager.addNamespace({})).toThrow('Invalid namespace')
            expect(mock).not.toHaveBeenCalled()
        })
        test('fails if namespace is not a valid string', () =>
        {
            const mock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._eventSource = {of:{}}
            manager._setupConnection = mock
            expect(() => manager.addNamespace('test')).toThrow('Invalid namespace')
            expect(mock).not.toHaveBeenCalled()
        })
        test('fails if namespace is too short', () =>
        {
            const mock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._eventSource = {of:{}}
            manager._setupConnection = mock
            expect(() => manager.addNamespace('t')).toThrow('Invalid namespace')
            expect(mock).not.toHaveBeenCalled()
        })
        test('succeeds if all input valid', () =>
        {
            const mock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._eventSource = {of:{}}
            manager._setupConnection = mock
            expect(() => manager.addNamespace('/test')).not.toThrow()
            expect(mock).toHaveBeenCalled()
        })
    })
    describe('Starting Tests', () =>
    {
        test('Should start', () =>
        {
            const mock1 = jest.fn()
            const mock2 = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._setupConnection = mock1
            manager._listen = mock2
            manager.start()
            expect(mock1).toHaveBeenCalledTimes(1)
            expect(mock1).toHaveBeenCalledTimes(1)
        })
    })
    describe('Connection Tests', () =>
    {
        test('should choose correct interface if no namespace', () =>
        {
            const mock1 = jest.fn()
            const mock2 = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._eventSource =
            {
                on:mock1,
                of:() => {return {on:mock2}}
            }
            manager._setupConnection()
            expect(mock1).toHaveBeenCalled()
            expect(mock2).not.toHaveBeenCalled()
        })
        test('should choose correct interface if namespace', () =>
        {
            const mock1 = jest.fn()
            const mock2 = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._eventSource =
            {
                on:mock1,
                of:() => {return {on:mock2}}
            }
            manager._setupConnection('/test')
            expect(mock1).not.toHaveBeenCalled()
            expect(mock2).toHaveBeenCalled()
        })
    })
    describe('Connection Tests', () =>
    {
        it('emits on new connection', () =>
        {
            const smock = jest.fn()
            const socket = 
            {
                id:'test',
                on:smock
            }
            const esmock = jest.fn().mockImplementation((type, func) => func(socket))
            const emock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._emitter = {emit:emock}
            manager._eventSource =
            {
                on:esmock,
            }
            manager._setupConnection()
            expect(esmock).toHaveBeenCalled()
            expect(emock).toHaveBeenCalledWith('test', {eventType:'newclient', senderId:'test'})
        })
        it('does not emit on empty data', () =>
        {
            const data = undefined
            const smock = jest.fn().mockImplementation((message, func) => func(data))
            const socket = 
            {
                id:'test',
                on:smock
            }
            const esmock = jest.fn().mockImplementation((type, func) => func(socket))
            const emock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._emitter = {emit:emock}
            manager._eventSource =
            {
                on:esmock,
            }
            manager._setupConnection()
            expect(smock).toHaveBeenCalled()
            expect(emock).toHaveBeenCalledTimes(2)
        })
        it('does not emit on empty data type', () =>
        {
            const data = {}
            const smock = jest.fn().mockImplementation((message, func) => func(data))
            const socket = 
            {
                id:'test',
                on:smock
            }
            const esmock = jest.fn().mockImplementation((type, func) => func(socket))
            const emock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._emitter = {emit:emock}
            manager._eventSource =
            {
                on:esmock,
            }
            manager._setupConnection()
            expect(smock).toHaveBeenCalled()
            expect(emock).toHaveBeenCalledTimes(2)
        })
        it('emits on data', () =>
        {
            const data = {msgType:'ttype', msgData:'tdata'}
            const smock = jest.fn().mockImplementation((message, func) => func(data))
            const socket = 
            {
                id:'test',
                on:smock
            }
            const esmock = jest.fn().mockImplementation((type, func) => func(socket))
            const emock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._emitter = {emit:emock}
            manager._eventSource =
            {
                on:esmock,
            }
            manager._setupConnection()
            expect(smock).toHaveBeenCalled()
            expect(emock).toHaveBeenCalledTimes(3)
        })
        it('emits correct data', () =>
        {
            const mock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._emitter = {emit:mock}
            manager.emit('testtype', {test:'test'})
            expect(mock).toHaveBeenCalledWith('test', {eventType:'testtype', test:'test'})
        })
        it('emits correct data with namespace', () =>
        {
            const mock = jest.fn()
            const manager = new Manager('test', new EventEmitter(), 'test')
            manager._emitter = {emit:mock}
            manager.emit('testtype', {test:'test'}, 'ns')
            expect(mock).toHaveBeenCalledWith('testns', {eventType:'testtype', test:'test'})
        })
    })
})