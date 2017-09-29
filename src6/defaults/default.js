const Handling = require('../handler');
const EventHandler = require('../lib/eventHandler');

function respond(source, msgType = 'fail', msgData = {}, ids = [this.senderId]) {
    source._emitter.emit(`${source._identifier}-response`, { ids, msgType, msgData });
}
function feedback(source, eventName, data = {}, opts = { timeout: 0, id: -1 }) {
    setTimeout(() => {
        source._receive({ eventType: eventName, data, senderId: opts.id || this.senderId });
    }, opts.timeout);
}
function broadcast(source, msgType = 'fail', msgData = {}) {
    source._emitter.emit(`${source._identifier}-response`, { ids: [this.senderId], msgType, msgData, broadcast: true });
}
function disconnect(source, ids = [this.senderId]) {
    source._emitter.emit(`${source._identifier}-response`, { ids, msgType: 'disconnect', msgData: {}, disconnect: true });
}

function errorHandler(eventName, errs, data, response, id) {
    if (errs instanceof Array) errs.forEach(err => {
        if (err instanceof Error) response.respond('unhandledError', err.msg);else if (err instanceof String) {
            let msg = `Validation Errors on event ${eventName}: ${err}`;
            response.respond('validationErrors', msg);
        } else response.respond('unhandledError', err);
    });
}
let defaultBuild = () => {
    let eventHandler = new EventHandler(errorHandler, { preFailFast: true, postFailFast: true, unknownActionMsg: 'Unknown Action' });
    let build = new Handling.HandlerBuild();
    build.setHandler(eventHandler);
    build.patchTools({
        respond,
        feedback,
        broadcast,
        disconnect
    });
    return build;
};
let emptyBuild = () => {
    return new Handling.HandlerBuild();
};
module.exports = {
    defaultBuild,
    emptyBuild
};