const Handler = require('../handler')

module.exports.buildHandler = function(build, emitter, identifier)
{
    let cBuild = build.build
    Object.keys(build.events).forEach(eventName =>
    {
        cBuild.registerPreValidator(eventName, ...build.events[eventName].preValidators)
        cBuild.registerMiddleware(eventName, ...build.events[eventName].middlewares)
        cBuild.registerPostValidator(eventName, ...build.events[eventName].postValidators)
        cBuild.registerHandler(eventName, ...build.events[eventName].handlers)
    })
    if(build.errorHandler)
        cBuild.setErrorHandler(build.errorHandler)
    return new Handler(cBuild, emitter, identifier)
}