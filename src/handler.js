const EventHandler = require('./lib/eventHandler');
const utils = require('./lib/utils');

class Handler {
  constructor(build, emitter, identifier) {
    this.__checkBuild(build);
    if (!emitter) {
      throw new Error('No emitter provided');
    }
    if (!identifier) {
      throw new Error('No identifier provided');
    }
    this._eventHandlers = [build.getHandler()];
    this._emitter = emitter;
    this._identifier = identifier;
    this._started = false;
    this._tools = {};
    this._receiver = this._receive.bind(this);
    Object.keys(build.getTools()).forEach(toolName => {
      this._tools[toolName] = utils.partial(build.getTools()[toolName], this);
    });
  }

  __checkBuild(build) {
    if (!build || !(build instanceof HandlerBuild)) {
      throw new Error('No build provided');
    }
    if (!build.getHandler()) {
      throw new Error('Build is incomplete. A handler must be specified');
    }
  }

  addBuild(build, overrideTools) {
    this.__checkBuild(build);
    Object.keys(build.getTools()).forEach(toolName => {
      if (this._tools[toolName] && !overrideTools) {
        throw new Error(`Tool ${toolName} already registered`);
      }
      this._tools[toolName] = utils.partial(build.getTools()[toolName], this);
    });
    this._eventHandlers.push(build.getHandler());
  }

  start() {
    if (this._started) {
      throw new Error('Handler already started');
    }
    this._emitter.on(this._identifier, this._receiver);
  }

  addSource(identifier) {
    this._emitter.on(identifier, this._receiver);
  }

  _receive({ eventType, senderId, data = {} }) {
    const response = this.__patchTools(data, senderId);
    this._eventHandlers.forEach(async handler => {
      await handler.handle(eventType, data, response, senderId);
    });
  }

  __patchTools(data, senderId) {
    const response = Object.assign({ data, senderId }, this._tools);
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
    if (!(handler instanceof EventHandler)) {
      throw new Error('Handler must be an event Handler');
    }
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
