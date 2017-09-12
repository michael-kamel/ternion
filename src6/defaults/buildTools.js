const Handling = require('../handler');
const Build = require('../handler').HandlerBuild;
const EventHandler = require('../lib/eventHandler');
const Manager = require('../manager');
const Emitter = require('../emitter');
const buildValidator = require('../lib/validator');

function constructBuild({ buildSpec, errorHandler, tools, opts }) {
    let base = new Build();
    let handler = new EventHandler(errorHandler, opts);
    Object.keys(buildSpec.events).map(evtName => {
        if (buildSpec.events[evtName].preValidators) handler.registerPreValidator(evtName, ...buildSpec.events[evtName].preValidators);
        if (buildSpec.events[evtName].middlewares) handler.registerMiddleware(evtName, ...buildSpec.events[evtName].middlewares);
        if (buildSpec.events[evtName].postValidators) handler.registerPostValidator(evtName, ...buildSpec.events[evtName].postValidators);
        if (buildSpec.events[evtName].handlers) handler.registerHandler(evtName, ...buildSpec.events[evtName].handlers);
    });
    base.patchTools(tools);
    base.setHandler(handler);
    return base;
}
function mergeBuilds({ errorHandler, opts, builds }) {
    let base = new Build();
    let handler = new EventHandler(errorHandler || builds[0].getHandler()._errorHandler, opts);
    handler.initEvent('newclient');
    handler.initEvent('disconnect');
    patchType(handler, builds, 'preValidators');
    patchType(handler, builds, 'middlewares');
    patchType(handler, builds, 'postValidators');
    patchType(handler, builds, 'handlers');
    base.patchTools(builds.reduce((acc, build) => Object.assign(acc, build.getTools()), {}));
    base.setHandler(handler);
    return base;
}
function patchType(handler, builds, typeName) {
    builds.forEach(bld => {
        Object.keys(bld.getHandler()._events).forEach(evtName => {
            handler.initEvent(evtName);
            if (bld.getHandler()._events[evtName][typeName]) handler._events[evtName][typeName] = handler._events[evtName][typeName].concat(bld.getHandler()._events[evtName][typeName]);
        });
    });
}
function constructHandler({ build, emitter, identifier }) {
    return new Handling.Handler(build, emitter, identifier);
}
function constructEventHandler({ errorHandler, opts }) {
    return new EventHandler(errorHandler, opts);
}
function constructManager({ eventSource, emitter, identifier }) {
    return new Manager(eventSource, emitter, identifier);
}
function constructEmitter() {
    return new Emitter();
}

module.exports = {
    constructBuild,
    mergeBuilds,
    constructHandler,
    constructEventHandler,
    constructManager,
    constructEmitter,
    buildValidator
};