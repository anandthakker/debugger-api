var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    extend = require('util')._extend,
    path = require('path'),
    debug = require('debug')('node-inspector-api'),
    
    DebuggerClient = require('node-inspector/lib/DebuggerClient').DebuggerClient,
    DebuggerAgent = require('node-inspector/lib/DebuggerAgent').DebuggerAgent,
    ScriptManager = require('node-inspector/lib/ScriptManager').ScriptManager,
    BreakEventHandler = require('node-inspector/lib/BreakEventHandler').BreakEventHandler,
    
    // our own FrontEndClient
    FrontendClient = require('./FrontendClient').FrontendClient;

inherits(DebuggerApi, EventEmitter);
extend(DebuggerApi.prototype, DebuggerAgent.prototype);
/**

# Methods:

##enable(null, function(error, result))

##disable(null, function(error, result))

##pause(null, function(error, result))

##resume(null, function(error, result))

Emits `Debugger.resumed`

##stepOver(null, function(error, result))

Emits `Debugger.resumed`

##stepInto(null, function(error, result))

Emits `Debugger.resumed`

##stepOut(null, function(error, result))

Emits `Debugger.resumed`

##continueToLocation({location: location}, function(error, result))

`location` is an object containing `scriptId`, `lineNumber`, and `columnNumber`.
Emits `Debugger.resumed`

##getScriptSource({scriptId: scriptId}, function(error, result))

`result` is  `{scriptSource: source}`

##setScriptSource({scriptId: id, scriptSource: source}, function(error, result))

`result` is `{callFrames: [...], result: result}`
TODO: what is `result`?

##setPauseOnExceptions({state: 'all' | 'uncaught'}, function(error, result))

TODO: cb(?)

##setBreakpointByUrl(params, function(error, result))
```
params = {url: scriptUrl,
          lineNumber: line number,
          columnNumber: column number,
          condition: stop condition}
```

`reponse` is `{breakpointId: id, locations: [...]}`

##removeBreakpoint({breakpointId: id}, function(error, result))

##setBreakpointsActive({active: boolean}, function(error, result))

##evaluateOnCallFrame({expression: string, callFrameId: frameId}, function(error, result))

`result` is `{result: inspectorResult | errorMessage, wasThrown: boolean }`

##getFunctionDetails({functionId: id}, function(error, result))

`result` is a function details object.

##restartFrame({callFrameId: id}, function(error, result))

`result` is `{callFrames: [...], result: result}`
TODO: what is `result`?

##setVariableValue(params, function(error, result))
```
params = {variableName, newValue, scopeNumber, callFrameId}
```
TODO: what is `result`?


 */
function DebuggerApi(options) {
  var self = this;
  if (!(this instanceof DebuggerApi)) return new DebuggerApi(options);
  EventEmitter.call(this);
  
  this._config = extend({
    debugPort: 5858
  }, options);


  var frontendClient, debuggerClient, scriptManager, breakEventHandler;

  frontendClient = new FrontendClient();
  frontendClient.on('message', function(message) {
    debug('message',message);
    message = (typeof message == 'string') ? {message: message} : message;
    if(!message.method) {
      debug('emit', 'message', message);
      self.emit('message', message);
    } else {
      self.emit(message.method, message.params);
    }
  });

  debuggerClient = new DebuggerClient(this._config.debugPort);
  debuggerClient.on('close', function(reason) {
    self.emit('close', reason);
  });
  debuggerClient.on('error', function(e) {
    self.emit('error', e);
  });

  scriptManager = new ScriptManager(
    this._config.isScriptHidden,
    frontendClient,
    debuggerClient
  );

  breakEventHandler = new BreakEventHandler(
    this._config,
    frontendClient,
    debuggerClient,
    scriptManager
  );

  DebuggerAgent.call(this, this._config,
                    frontendClient,
                    debuggerClient,
                    breakEventHandler,
                    scriptManager);

  this.scripts = scriptManager;
}

DebuggerApi.prototype.close = function() {
  //TODO
};


['pause',
 'resume',
 'enable',
 'disable',
 'stepOver',
 'stepInto',
 'stepOut',
 'continueToLocation',
 'getScriptSource',
 'setScriptSource',
 'setPauseOnExceptions',
 'setBreakpointByUrl',
 'removeBreakpoint',
 'evaluateOnCallFrame',
 'getFunctionDetails',
 'restartFrame',
 'setVariableValue'
 ].forEach(function(fn) {
   DebuggerApi.prototype[fn] = function(params, callback) {
     DebuggerAgent.prototype[fn].call(this, params, callback ? callback : function() {});
   };
 });



module.exports = DebuggerApi;
