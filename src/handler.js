const EventHandler = require('./lib/eventHandler')
const utils = require('./lib/utils')

class Handler
{
    constructor(build, emitter, identifier)
    {
        if(!build || !(build instanceof HandlerBuild))
            throw new Error('No build provided')
        if(!build.getHandler())
            throw new Error('Build is incomplete. A handler must be specified')
        if(!emitter)
            throw new Error('No emitter provided')
        if(!identifier)
            throw new Error('No identifier provided')
        this._eventHandler = build.getHandler()
        this._emitter = emitter
        this._identifier = identifier
        this._started = false
        this._tools = {}
        Object.keys(build.getTools()).map(toolName => 
        {
            this._tools[toolName] = utils.partial(build.getTools()[toolName], this)
        })
    }
    start()
    {
        if(this._started)
            throw new Error('Handler already started')
        let receive = this._receive.bind(this)
        this._emitter.on(this._identifier, receive)
    }
    _receive({eventType, senderId, data = {}})
    {
        let response = this.__patchTools(data, senderId)
        this._eventHandler.handle(eventType, data, response, senderId)
    }
    __patchTools(data, senderId)
    {
        let response = Object.assign({data, senderId}, this._tools)
        return response
    }
}
class HandlerBuild
{
    constructor()
    {
        this._tools = {}
    }
    getHandler()
    {
        return this._handler
    }
    getTools()
    {
        return this._tools
    }
    setHandler(handler)
    {
        if(!(handler instanceof EventHandler))
            throw new Error('Handler must be an event Handler')
        this._handler = handler
        return this
    }
    patch(tools)
    {
        Object.assign(this._tools, tools)
        return this
    }
}

module.exports = 
{
    Handler,
    HandlerBuild
}