const Emitter = require('../src6/emitter')

const EventEmitter = require('events')

describe('Emitter Tests', () => {
  test('constructs valid emitter', () => {
    expect(new Emitter(new EventEmitter())).toBeInstanceOf(Emitter)
  })
  test('does not construct invalid emitter', () => {
    expect(() => new Emitter({})).toThrowError()
  })
  test('gets emitter', () => {
    const emitt = new EventEmitter()
    const emitter = new Emitter(emitt)
    expect(emitter.getEmitter()).toBe(emitt)
  })
  test('calls emit correctly', () => {
    const emitt = new EventEmitter()
    const emitter = new Emitter(emitt)
    const mock = jest.fn()
    emitt.emit = mock
    emitter.emit('test', 'data')
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('test', 'data')
  })
  test('adds listener correctly', () => {
    const emitt = new EventEmitter()
    const emitter = new Emitter(emitt)
    const mock = jest.fn()
    emitt.addListener = mock
    const listener = () => {}
    emitter.addListener('tev', listener)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('tev', listener)
  })
  test('removes listener correctly', () => {
    const emitt = new EventEmitter()
    const emitter = new Emitter(emitt)
    const mock = jest.fn()
    emitt.removeListener = mock
    const listener = () => {}
    emitter.removeListener('tev', listener)
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('tev', listener)
  })
  test('auto fills listener', () => {
    const emitter = new Emitter()
    expect(emitter._emitter).toBeInstanceOf(EventEmitter)
  })
})
