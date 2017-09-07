const Handling = require('../handler');

module.exports.buildHandler = function (build, emitter, identifier) {
    let cBuild = build.build;
    cBuild.getHandler().initEvent('newclient');
    cBuild.getHandler().initEvent('disconnect');
    Object.keys(build.events).forEach(eventName => {
        if (build.events[eventName].preValidators) cBuild.getHandler().registerPreValidator(eventName, ...build.events[eventName].preValidators);
        if (build.events[eventName].middlewares) cBuild.getHandler().registerMiddleware(eventName, ...build.events[eventName].middlewares);
        if (build.events[eventName].postValidators) cBuild.getHandler().registerPostValidator(eventName, ...build.events[eventName].postValidators);
        if (build.events[eventName].handlers) cBuild.getHandler().registerHandler(eventName, ...build.events[eventName].handlers);
    });
    if (build.errorHandler) cBuild.getHandler().setErrorHandler(build.errorHandler);
    return new Handling.Handler(cBuild, emitter, identifier);
};