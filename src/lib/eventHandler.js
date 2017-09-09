const utils = require('./utils')

class EventHandler
{
    constructor(errorHandler, opts)
    {
        this._events = {}
        this._errorHandler = errorHandler
        this._opts = {}
        this.setOpts(opts)
    }
    setErrorHandler(handler)
    {
        this._errorHandler = handler
    }
    setOpts(opts = {})
    {
        this._opts.preFailFast = opts.hasOwnProperty('preFailFast') ? opts.preFailFast : true
        this._opts.postFailFast = opts.hasOwnProperty('postFailFast') ? opts.postFailFast : true
        this._opts.unknownActionMsg = opts.unknownActionMsg || 'Unknown Acion'
    }
    registerPreValidator(eventName, ...validators)
    {
        this.initEvent(eventName)
        validators.forEach(validator =>
        {
            this._events[eventName].preValidators.push(validator)
        })
    }
    registerPostValidator(eventName, ...validators)
    {
        this.initEvent(eventName)
        validators.forEach(validator =>
        {
            this._events[eventName].postValidators.push(validator)
        })
    }
    registerHandler(eventName, ...handlers)
    {
        this.initEvent(eventName)
        handlers.forEach(handler => 
        {
            this._events[eventName].handlers.push(handler)
        })
    }
    registerMiddleware(eventName, ...middlewares)
    {
        this.initEvent(eventName)
        middlewares.forEach(handler => 
        {
            this._events[eventName].middlewares.push(handler)
        })
    }
    _preValidate(eventName, args = [])
    {
        return this._validate(eventName, this._events[eventName].preValidators, args, this._opts.preFailFast)
    }
    _postValidate(eventName, args = [])
    {
        return this._validate(eventName, this._events[eventName].postValidators, args, this._opts.postFailFast)
    }
    async _validate(eventName, validators, args, failFast)
    {
        let result = []
        if(failFast)
        {
            await utils.asyncSome(validators, async validator =>
            {
                let val = await validator.apply(validator, args)
                if(!val)
                {
                    result = [validator.msg]
                    return true
                }
                return false
            })
        }
        else
        {
            result = await validators.reduce(async (acc, validator) =>
            {
                let val = await validator.apply(validator, args)
                return val ? acc: (await acc).concat(validator.msg)
            }, Promise.resolve([]))
        }
        if(result.length > 0)
        {
            this._errorHandler(eventName, result, ...args)
            return false
        }
        return true
    }
    async _applyMiddlewares(eventName, args)
    {
        await this._events[eventName].middlewares.reduce((acc, middleware) => acc.then(result => middleware.apply(middleware, args)), Promise.resolve())
    }
    _applyHandlers(eventName, args)
    {
        this._events[eventName].handlers.forEach(handler => handler.apply(handler, args))
    }
    async handle(eventName, ...args)
    {
        if(!this._events[eventName])
        {
            this._errorHandler(eventName, [this._opts.unknownActionMsg], ...args)
            return
        }
        try
        {
            let preValidationResult = await this._preValidate(eventName, args)
            if(!preValidationResult)
                return
            await this._applyMiddlewares(eventName, args)
            let postValidationResult = await this._postValidate(eventName, args)
            if(!postValidationResult)
                return
            await this._applyHandlers(eventName, args)
        }
        catch(err)
        {
            this._errorHandler(eventName, err, ...args)
        }
    }
    initEvent(eventName)
    {
        if(!this._events[eventName])
            this._events[eventName] = 
            {
                postValidators:[],
                preValidators:[],
                handlers:[],
                middlewares:[]
            }
    }
}

module.exports = EventHandler