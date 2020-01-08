const Handling = require('../handler');
const EventHandler = require('../lib/eventHandler');
const Errors = require('../lib/errors');

function respond(
  source,
  msgType = 'fail',
  msgData = {},
  ids = [this.senderId]
) {
  source._emitter.emit(`${source._identifier}-response`, {
    ids,
    msgType,
    msgData
  });
}

function feedback(source, eventName, data = {}, opts = { timeout: 0, id: -1 }) {
  setTimeout(() => {
    source._receive({
      eventType: eventName,
      data,
      senderId: opts.id || this.senderId
    });
  }, opts.timeout);
}

function broadcast(source, msgType = 'fail', msgData = {}) {
  source._emitter.emit(`${source._identifier}-response`, {
    ids: [this.senderId],
    msgType,
    msgData,
    broadcast: true
  });
}

function disconnect(source, ids = [this.senderId]) {
  source._emitter.emit(`${source._identifier}-response`, {
    ids,
    msgType: 'disconnect',
    msgData: {},
    disconnect: true
  });
}

function errorHandler(eventName, errs, data, response, id) {
  if (errs instanceof Array) {
    errs.forEach(err => {
      if (err instanceof Errors.ValidationError) {
        const msg = `Validation Errors on event ${eventName}: ${err.message}`;
        response.respond('validationErrors', msg);
      } else if (err instanceof Errors.UnknownActionError) {
        const msg = `${err.message}. message: ${eventName}`;
        response.respond('unrecongnizedMessage', msg);
      } else if (err instanceof Error) {
        response.respond('unhandledError', err.message);
      }
    });
  }
}

const defaultBuild = () => {
  const eventHandler = new EventHandler(errorHandler, {
    preFailFast: true,
    postFailFast: true,
    unknownActionMsg: 'Unknown Action'
  });
  const build = new Handling.HandlerBuild();
  build.setHandler(eventHandler);
  build.patchTools({
    respond,
    feedback,
    broadcast,
    disconnect
  });
  return build;
};

const emptyBuild = () => {
  return new Handling.HandlerBuild();
};

module.exports = {
  defaultBuild,
  emptyBuild
};
