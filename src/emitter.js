const EventEmitter = require('events')

class Emitter
{
    constructor(emitter = new EventEmitter())
    {
        if(!(emitter instanceof EventEmitter))
            throw new Error('Emitter must be an event emitter')
        this._emitter = emitter
    }
    on(event, listener)
    {
        this._emitter.addListener(event, listener)
    }
    removeListener(event, listener)
    {
        this._emitter.removeListener(event, listener)
    }
    addListener(event, listener)
    {
        this.on(event, listener)
    }
    emit(eventName, data)
    {
        this._emitter.emit(eventName, data)
    }
    getEmitter()
    {
        return this._emitter
    }
}

module.exports = Emitter