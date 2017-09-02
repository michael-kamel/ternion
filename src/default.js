const Handler = require('./handler')

function respond(source, msgType = 'fail', msgData={})
{
    source._emitter.emit(`${source._identifier}-response`, {ids:[this.senderId], msgType, msgData}) 
}
function feedback(source, eventName, data = {}, opts = {timeout:0, id:-1})
{
    setTimeout(() =>
    {
        source._receive({eventType:eventName, data, senderId:opts.id || this.senderId})
    }, opts.timeout)
}
function broadcast(source, msgType = 'fail', msgData={})
{
    source._emitter.emit(`${source._identifier}-response`, {ids:[this.senderId], msgType, msgData, broadcast:true}) 
}
function errorHandler(errs, data, response, id)
{
    let msg = `Validation Errors: ${errs.join('/n')}`
    response.respond('validationErrors', msg)
}
let defaultBuild = () =>
{
    let build = new Handler.Builder(errorHandler, {failFast:true, unknownActionMsg:'Unknown Action'})
    build.patch
    ({
        respond,
        feedback,
        broadcast
    })
    return build
}

module.exports = defaultBuild