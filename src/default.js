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
let defaultBuild = new Handler.Builder(errorHandler, {failFast:true, unknownActionMsg:'Unknown Action'})
defaultBuild.patch
({
    respond,
    feedback,
    broadcast
})

module.exports = defaultBuild