function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const utils = require('./utils');

class EventHandler {
    constructor(errorHandler, opts) {
        this._events = {};
        this._errorHandler = errorHandler;
        this._opts = {};
        this.setOpts(opts);
    }
    setErrorHandler(handler) {
        this._errorHandler = handler;
    }
    setOpts(opts = {}) {
        this._opts.preFailFast = opts.hasOwnProperty('preFailFast') ? opts.preFailFast : true;
        this._opts.postFailFast = opts.hasOwnProperty('postFailFast') ? opts.postFailFast : true;
        this._opts.unknownActionMsg = opts.unknownActionMsg || 'Unknown Acion';
        this._opts.ignoreUnregisteredEvents = opts.hasOwnProperty('ignoreUnregisteredEvents') ? opts.ignoreUnregisteredEvents : true;
    }
    registerPreValidator(eventName, ...validators) {
        this.initEvent(eventName);
        validators.forEach(validator => {
            this._events[eventName].preValidators.push(validator);
        });
    }
    registerPostValidator(eventName, ...validators) {
        this.initEvent(eventName);
        validators.forEach(validator => {
            this._events[eventName].postValidators.push(validator);
        });
    }
    registerHandler(eventName, ...handlers) {
        this.initEvent(eventName);
        handlers.forEach(handler => {
            this._events[eventName].handlers.push(handler);
        });
    }
    registerMiddleware(eventName, ...middlewares) {
        this.initEvent(eventName);
        middlewares.forEach(handler => {
            this._events[eventName].middlewares.push(handler);
        });
    }
    _preValidate(eventName, args = []) {
        return this._validate(eventName, this._events[eventName].preValidators, args, this._opts.preFailFast);
    }
    _postValidate(eventName, args = []) {
        return this._validate(eventName, this._events[eventName].postValidators, args, this._opts.postFailFast);
    }
    _validate(eventName, validators, args, failFast) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let result = [];
            if (failFast) {
                yield utils.asyncSome(validators, (() => {
                    var _ref = _asyncToGenerator(function* (validator) {
                        let val = yield validator.apply(validator, args);
                        if (!val) {
                            result = [validator.msg];
                            return true;
                        }
                        return false;
                    });

                    return function (_x) {
                        return _ref.apply(this, arguments);
                    };
                })());
            } else {
                result = yield validators.reduce((() => {
                    var _ref2 = _asyncToGenerator(function* (acc, validator) {
                        let val = yield validator.apply(validator, args);
                        return val ? acc : (yield acc).concat(validator.msg);
                    });

                    return function (_x2, _x3) {
                        return _ref2.apply(this, arguments);
                    };
                })(), Promise.resolve([]));
            }
            if (result.length > 0) {
                _this._handleErrors(eventName, result, args);
                return false;
            }
            return true;
        })();
    }
    _applyMiddlewares(eventName, args) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2._events[eventName].middlewares.reduce(function (acc, middleware) {
                return acc.then(function (result) {
                    return middleware.apply(middleware, args);
                });
            }, Promise.resolve());
        })();
    }
    _applyHandlers(eventName, args) {
        this._events[eventName].handlers.forEach(handler => handler.apply(handler, args));
    }
    handle(eventName, ...args) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            if (!_this3._events[eventName]) {
                if (!_this3._opts.ignoreUnregisteredEvents) _this3._handleErrors(eventName, [_this3._opts.unknownActionMsg], args);
                return;
            }
            try {
                let preValidationResult = yield _this3._preValidate(eventName, args);
                if (!preValidationResult) return;
                yield _this3._applyMiddlewares(eventName, args);
                let postValidationResult = yield _this3._postValidate(eventName, args);
                if (!postValidationResult) return;
                yield _this3._applyHandlers(eventName, args);
            } catch (err) {
                _this3._handleErrors(eventName, err, args);
            }
        })();
    }
    _handleErrors(eventName, err, args) {
        if (this._errorHandler) this._errorHandler(eventName, err, ...args);
    }
    initEvent(eventName) {
        if (!this._events[eventName]) this._events[eventName] = {
            postValidators: [],
            preValidators: [],
            handlers: [],
            middlewares: []
        };
    }
}

module.exports = EventHandler;