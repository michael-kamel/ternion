const builds = require("./src/defaults/default");
const buildTools = require("./src/defaults/buildTools");
const emitter = require("./src/emitter");
const handler = require("./src/handler");
const manager = require("./src/manager");

module.exports = {
  Manager: manager,
  Emitter: emitter,
  Handling: handler,
  builds,
  buildTools
};
