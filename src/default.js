const Handler = require('./handler')

function respond(msgType = 'fail', msgData={})
{
    this.source._emitter.emit(`${this.source._identifier}-response`, {ids:[this.senderId], msgType, msgData}) 
}
function feedback(eventName, data = {}, opts)
{
    let timeout = opts.timeout || 0
    let id = opts.id || -1
    setTimeout(() =>
    {
        this.source._recieve(eventName, data, id)
    }, timeout)
}
function broadcast(msgType = 'fail', msgData={})
{
    this.source._emitter.emit(`${this.source._identifier}-response`, {ids:[], msgType, msgData, broadcast:true}) 
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