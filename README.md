# Ternion

[![Build Status](https://travis-ci.org/michael-kamel/ternion.svg?branch=master)](https://travis-ci.org/michael-kamel/ternion)
[![Coverage Status](https://coveralls.io/repos/github/michael-kamel/ternion/badge.svg?branch=master)](https://coveralls.io/github/michael-kamel/ternion?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/michael-kamel/ternion/badge.svg)](https://snyk.io/test/github/michael-kamel/ternion)
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://img.shields.io/packagist/l/doctrine/orm.svg)
[![DeepScan grade](https://deepscan.io/api/teams/6299/projects/8218/branches/94587/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6299&pid=8218&bid=94587)

## A plugable socket.io framework that does the job for you

## ~~This project is still under development~~

### Sample usage

``` javascript
const ternion = require('ternion');
const sockio = require('socket.io');
const io = sockio(8000);

const IDENTIFIER = 'id';
const emitter = ternion.buildTools.constructEmitter();
const defaultBuild = ternion.builds.defaultBuild();

let names = [];
let loggedIn = {};
const nameExistsValidator = ternion.buildTools.buildValidator((data, response, id) => names.indexOf(data.name) === -1, 'Name exists');
const nameLengthValidator = ternion.buildTools.buildValidator((data, response, id) => data.name.length > 2, 'Name must be of length 3 atleast');
const hasNameValidator = ternion.buildTools.buildValidator((data, response, id) => !!data.name, 'No Name provided');
const loggedInValidator = ternion.buildTools.buildValidator((data, response, id) => !!loggedIn[id], 'Not logged in');
const hasMsgValidator = ternion.buildTools.buildValidator((data, response, id) => !!data.msg, 'No message provided');
const msgEmptyValidator = ternion.buildTools.buildValidator((data, response, id) => data.msg.length > 2, 'Message must be of length 3 at least');
const nameFillMiddleware = (data, response, id) => { data.name = loggedIn[id] };
const loginHandler = (data, response, id) =>
{
    loggedIn[id] = data.name;
    names.push(data.name);
    response.respond('loginsuccess');
};
const msgHandler = (data, response, id) =>
{
    response.broadcast('message', {name:data.name, msg:data.msg});
    response.respond('message', {name:data.name, msg:data.msg});
}
const welcomeMsg = (data, response, id) =>
{
    response.respond('misc', {name:data.name, msg:'Welcome'});
}
const disconnect = (data, response, id) =>
{
    delete loggedIn[id];
    names.splice(names.indexOf(data.name), 1);
}


let buildSpec =
{
    events:
    {
        newclient:
        {
            handlers:[welcomeMsg]
        },
        disconnect:
        {
            middlewares:[nameFillMiddleware],
            handlers:[disconnect]
        },
        login:
        {
            preValidators:[hasNameValidator, nameLengthValidator, nameExistsValidator],
            handlers:[loginHandler]
        },
        message:
        {
            preValidators:[loggedInValidator, hasMsgValidator, msgEmptyValidator],
            middlewares:[nameFillMiddleware],
            handlers:[msgHandler]
        }
    }
};
const newBuild = ternion.buildTools.constructBuild(
{
    buildSpec,
    opts:{preFailFast:true, postFailFast:true, unknownActionMsg:'unknown', ignoreUnregisteredEvents:false}
});

const build = ternion.buildTools.mergeBuilds({builds:[defaultBuild, newBuild]});
const handler = ternion.buildTools.constructHandler({build, emitter, identifier:IDENTIFIER});
const sock = ternion.buildTools.constructManager({eventSource:io, emitter, identifier:IDENTIFIER});

sock.start();
handler.start();
```

``` javascript
const io = require('socket.io-client');

let client = io('http://localhost:8000/');
  client.on('connect', function()
  {
      console.log('connected');
      client.emit('message', {msgType:'login', msgData:{name:'testname'}});
  });
  client.on('message', function(data)
  {
      let mdata = data.msgData;
      switch(data.msgType)
      {
        case 'validationErrors': console.log(mdata); break;
        case 'loginsuccess': { console.log('logged in');  client.emit('message', {msgType:'message', msgData:{msg:'some random msg'}}); break; }
        case 'misc': console.log(mdata.msg); break;
        case 'message': console.log('message from ' + mdata.name + ' : ' + mdata.msg); break;
        case 'unhandledError': console.log('unhandled: ' + mdata); break;
        case 'unrecongnizedMessage': console.log('unrecongnized: ' + mdata); break;
      }
  });
  client.on('disconnect', function(){ console.log('server closed connection')});

```
