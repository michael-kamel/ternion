const EventHandler = require('./lib/eventHandler')

class Handler
{
    constructor(builder, emitter, identifier)
    {
        if(!builder || !(builder instanceof HandlerBuilder))
            throw new Error('No builder provided')
        if(!emitter)
            throw new Error('No emitter provided')
        if(!identifier)
            throw new Error('No identifier provided')
        this._eventHandler = builder.getHandler()
        this._tools = builder.getTools()
        this._emitter = emitter
        this._identifier = identifier
        this._started = false
    }
    start()
    {
        if(this._started)
            throw new Error('Handler already started')
        this._emitter.on(this._identifier, this._receive.bind(this))
    }
    _receive({eventType, senderId, data = {}})
    {
        let response = this.__patchTools(data, senderId)
        this._eventHandler.handle(eventType, data || {}, response, senderId)
    }
    __patchTools(data, id)
    {
        let response = {}
        response.source = this
        response.data = data
        response.senderId = id
        Object.assign(response, this._tools)
        return response
    }
}
class HandlerBuilder
{
    constructor(errorHandler, opts)
    {
        this._handler = new EventHandler(errorHandler, opts)
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
    setErrorHandler(func)
    {
        this._handler.setErrorHandler(func)
        return this
    }
    registerPreValidator(...args)
    {
        this._handler.registerPreValidator.apply(this._handler, args)
        return this
    }
    registerPostValidator(...args)
    {
        this._handler.registerPostValidator.apply(this._handler, args)
        return this
    }
    registerMiddleware(...args)
    {
        this._handler.registerMiddleware.apply(this._handler, args)
        return this
    }
    registerHandler(...args)
    {
        this._handler.registerHandler.apply(this._handler, args)
        return this
    }
    patch(tools)
    {
        Object.assign(this._tools, tools)
        return this
    }
}
Handler.Builder = HandlerBuilder

module.exports = Handler