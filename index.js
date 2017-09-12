const builds = require('./src6/defaults/default')
const buildTools = require('./src6/defaults/buildTools')
const emitter = require('./src6/emitter')
const handler = require('./src6/handler')
const manager = require('./src6/manager')

module.exports =
{
    Manager:manager,
    Emitter:emitter,
    Handling:handler,
    builds,
    buildTools
}