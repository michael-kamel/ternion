const EventEmitter = require('events')
const Emitter = require('./emitter')

class Manager
{
    constructor(eventSource, emitter, identifier)
    {
        if(!eventSource)
            throw new Error('No event source provided')
        if(!emitter || !(emitter instanceof EventEmitter || emitter instanceof Emitter))
            throw new Error('No emitter provided')
        if(!identifier)
            throw new Error('No identifier provided')
        this._eventSource = eventSource
        this._emitter = emitter
        this._identifier = identifier
    }
    start()
    {
        this._setupConnection()
        this._listen()
    }
    _listen()
    {
        let self = this
        this._emitter.on(`${this._identifier}-response`, function(msg)
        {
            if(!msg || !msg.msgType || !msg.msgData || !msg.ids)
                return
            if(msg.broadcast)
            {
                if(self._eventSource.sockets.connected[msg.ids[0]])
                    self._eventSource.sockets.connected[msg.ids[0]].broadcast.emit('message', {msgType:msg.msgType, msgData:msg.msgData})
            }
            else
            {
                msg.ids.forEach(id =>
                {
                    if(self._eventSource.sockets.connected[id])
                        self._eventSource.sockets.connected[id].emit('message', {msgType:msg.msgType, msgData:msg.msgData})
                })
            }
        })
    }
    addNamespace(namespace)
    {
        if(!this._eventSource.of)
            throw new Error('The provided event source does not support namespacing')
        if(!namespace || typeof namespace !== "string" || !namespace.startsWith('/') || namespace.length < 2)
            throw new Error('Invalid namespace') 
        this._setupConnection(namespace)
    }
    _setupConnection(namespace = '')
    {
        let nsp = namespace === '' ? this._eventSource : this._eventSource.of(namespace)
        let self = this
        nsp.on('connection', function (socket) 
        {
            self._emitter.emit(`${self._identifier}${namespace}`, {eventType:'newclient', senderId:socket.id})
            socket.on('message', function (data) 
            { 
                if(!data || !data.msgType)
                    return
                self._emitter.emit(`${self._identifier}${namespace}`, {eventType:data.msgType, senderId:socket.id, data:data.msgData || {}})
            })
            socket.on('disconnect', function (reason) 
            { 
                self._emitter.emit(`${self._identifier}${namespace}`, {eventType:'disconnect', senderId:socket.id})
            })
        })
    }
}

module.exports = Manager