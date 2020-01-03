const utils = require('./utils');
const Errors = require('./errors');

class EventHandler {
  constructor (errorHandler, opts) {
    this._events = {};
    this._errorHandler = errorHandler;
    this._opts = {};
    this.setOpts(opts);
  }

  setErrorHandler (handler) {
    this._errorHandler = handler;
  }

  setOpts (opts = {}) {
    this._opts.preFailFast = opts.preFailFast === undefined ? true : opts.preFailFast;
    this._opts.postFailFast = opts.postFailFast === undefined ? true : opts.postFailFast;
    this._opts.unknownActionMsg = opts.unknownActionMsg === undefined ? 'Unknown Action' : opts.unknownActionMsg;
    this._opts.ignoreUnregisteredEvents = opts.ignoreUnregisteredEvents === undefined ? true : opts.ignoreUnregisteredEvents;
  }

  registerPreValidator (eventName, ...validators) {
    this.initEvent(eventName);
    validators.forEach(validator => {
      this._events[eventName].preValidators.push(validator);
    });
  }

  registerPostValidator (eventName, ...validators) {
    this.initEvent(eventName);
    validators.forEach(validator => {
      this._events[eventName].postValidators.push(validator);
    });
  }

  registerHandler (eventName, ...handlers) {
    this.initEvent(eventName);
    handlers.forEach(handler => {
      this._events[eventName].handlers.push(handler);
    });
  }

  registerMiddleware (eventName, ...middlewares) {
    this.initEvent(eventName);
    middlewares.forEach(handler => {
      this._events[eventName].middlewares.push(handler);
    });
  }

  _preValidate (eventName, args = []) {
    return this._validate(eventName, this._events[eventName].preValidators, args, this._opts.preFailFast);
  }

  _postValidate (eventName, args = []) {
    return this._validate(eventName, this._events[eventName].postValidators, args, this._opts.postFailFast);
  }

  async _validate (eventName, validators, args, failFast) {
    let result = [];
    if (failFast) {
      await utils.asyncSome(validators, async validator => {
        const val = await validator.apply(validator, args);
        if (!val) {
          result = [ new Errors.ValidationError(validator.msg) ];
          return true;
        }
        return false;
      });
    } else {
      result = await validators.reduce(async (acc, validator) => {
        const val = await validator.apply(validator, args);
        return val ? acc : (await acc).concat(new Errors.ValidationError(validator.msg));
      }, Promise.resolve([]));
    }
    if (result.length > 0) {
      this._handleErrors(eventName, result, args);
      return false;
    }
    return true;
  }

  async _applyMiddlewares (eventName, args) {
    await this._events[eventName].middlewares.reduce((acc, middleware) => acc.then(result => middleware.apply(middleware, args)), Promise.resolve());
  }

  async _applyHandlers (eventName, args) {
    await this._events[eventName].handlers.reduce((acc, handler) => acc.then(result => handler.apply(handler, args)), Promise.resolve());
  }

  async handle (eventName, ...args) {
    if (!this._events[eventName]) {
      if (!this._opts.ignoreUnregisteredEvents) { this._handleErrors(eventName, [ new Errors.UnknownActionError(this._opts.unknownActionMsg) ], args); }
      return;
    }
    try {
      const preValidationResult = await this._preValidate(eventName, args);
      if (!preValidationResult) { return; }
      await this._applyMiddlewares(eventName, args);
      const postValidationResult = await this._postValidate(eventName, args);
      if (!postValidationResult) { return; }
      await this._applyHandlers(eventName, args);
    } catch (err) {
      this._handleErrors(eventName, [ err ], args);
    }
  }

  _handleErrors (eventName, errs, args) {
    if (this._errorHandler) { this._errorHandler(eventName, errs, ...args); }
  }

  initEvent (eventName) {
    if (!this._events[eventName]) {
      this._events[eventName] =
            {
              postValidators: [],
              preValidators: [],
              handlers: [],
              middlewares: []
            };
    }
  }
}

module.exports = EventHandler;
