const utils = require('./utils')

class EventHandler
{
    constructor(errorHandler, opts = {failFast:true, unknownActionMsg:'Unknown Action'})
    {
        this._events = {}
        this._errorHandler = errorHandler
        this._opts = opts
    }
    setErrorHandler(handler)
    {
        this._errorHandler = handler
    }
    registerPreValidator(eventName, ...validators)
    {
        this._initEvent(eventName)
        validators.forEach(validator =>
        {
            this._events[eventName].preValidators.push(validator)
        })
    }
    registerPostValidator(eventName, ...validators)
    {
        this._initEvent(eventName)
        validators.forEach(validator =>
        {
            this._events[eventName].postValidators.push(validator)
        })
    }
    registerHandler(eventName, ...handlers)
    {
        this._initEvent(eventName)
        handlers.forEach(handler => 
        {
            this._events[eventName].handlers.push(handler)
        })
    }
    registerMiddleware(eventName, ...middlewares)
    {
        this._initEvent(eventName)
        middlewares.forEach(handler => 
        {
            this._events[eventName].middlewares.push(handler)
        })
    }
    _preValidate(eventName, args = [])
    {
        return this._validate(eventName, args, this._events[eventName].preValidators)
    }
    _postValidate(eventName, args = [])
    {
        return this._validate(eventName, args, this._events[eventName].postValidators)
    }
    async _validate(eventName, args, validators)
    {
        let result = []
        if(this._opts.failFast)
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
                return val ? acc: acc.concat(validator.msg)
            }, Promise.resolve([]))
        }
        if(result.length > 0)
        {
            this._errorHandler(result, ...args)
            return false
        }
        return true
    }
    async _applyMiddlewares(eventName, args)
    {
        await this._events[eventName].middlewares.reduce((acc, middleware) => acc.then(result => middleware.apply(middleware, args)), Promise.resolve())
    }
    async _applyHandlers(eventName, args)
    {
        await Promise.all(this._events[eventName].handlers)
    }
    async handle(eventName, ...args)
    {
        if(!this._events[eventName])
        {
            this._errorHandler([this._opts.unknownActionMsg], ...args)
            return
        }
        let preValidationResult = await this._preValidate(eventName, args)
        if(!preValidationResult)
            return
        await this._applyMiddlewares(eventName, args)
        let postValidationResult = await this._postValidate(eventName, args)
        if(!postValidationResult)
            return
        await this._applyHandlers(eventName, args)
    }
    _initEvent(eventName)
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