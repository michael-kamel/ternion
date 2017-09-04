const Handling = require('../handler')

module.exports.buildHandler = function(build, emitter, identifier)
{
    let cBuild = build.build
    Object.keys(build.events).forEach(eventName =>
    {
        cBuild.getHandler().registerPreValidator(eventName, ...build.events[eventName].preValidators)
        cBuild.getHandler().registerMiddleware(eventName, ...build.events[eventName].middlewares)
        cBuild.getHandler().registerPostValidator(eventName, ...build.events[eventName].postValidators)
        cBuild.getHandler().registerHandler(eventName, ...build.events[eventName].handlers)
    })
    if(build.errorHandler)
        cBuild.getHandler().setErrorHandler(build.errorHandler)
    return new Handling.Handler(cBuild, emitter, identifier)
}