function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const EventHandler = require('./lib/eventHandler');
const utils = require('./lib/utils');

class Handler {
    constructor(build, emitter, identifier) {
        this.__checkBuild(build);
        if (!emitter) throw new Error('No emitter provided');
        if (!identifier) throw new Error('No identifier provided');
        this._eventHandlers = [build.getHandler()];
        this._emitter = emitter;
        this._identifier = identifier;
        this._started = false;
        this._tools = {};
        this._receiver = this._receive.bind(this);
        Object.keys(build.getTools()).map(toolName => {
            this._tools[toolName] = utils.partial(build.getTools()[toolName], this);
        });
    }
    __checkBuild(build) {
        if (!build || !(build instanceof HandlerBuild)) throw new Error('No build provided');
        if (!build.getHandler()) throw new Error('Build is incomplete. A handler must be specified');
    }
    addBuild(build, overrideTools) {
        this.__checkBuild(build);
        Object.keys(build.getTools()).map(toolName => {
            if (this._tools[toolName] && !overrideTools) throw new Error(`Tool ${toolName} already registered`);
            this._tools[toolName] = utils.partial(build.getTools()[toolName], this);
        });
        this._eventHandlers.push(build.getHandler());
    }
    start() {
        if (this._started) throw new Error('Handler already started');
        this._emitter.on(this._identifier, this._receiver);
    }
    addSource(identifier) {
        this._emitter.on(identifier, this._receiver);
    }
    _receive({ eventType, senderId, data = {} }) {
        let response = this.__patchTools(data, senderId);
        this._eventHandlers.forEach((() => {
            var _ref = _asyncToGenerator(function* (handler) {
                yield handler.handle(eventType, data, response, senderId);
            });

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        })());
    }
    __patchTools(data, senderId) {
        let response = Object.assign({ data, senderId }, this._tools);
        return response;
    }
}
class HandlerBuild {
    constructor() {
        this._tools = {};
    }
    getHandler() {
        return this._handler;
    }
    getTools() {
        return this._tools;
    }
    setHandler(handler) {
        if (!(handler instanceof EventHandler)) throw new Error('Handler must be an event Handler');
        this._handler = handler;
        return this;
    }
    patchTools(tools) {
        Object.assign(this._tools, tools);
        return this;
    }
}

module.exports = {
    Handler,
    HandlerBuild
};