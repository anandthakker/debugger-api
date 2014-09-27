# debugger-api

A thin adapter that gives direct access to [node-inspector][1]'s backend.

Normally, node-inspector is acting both as a *client*--to a process run with `node --debug`--and
also as a *server*--serving up a web(kit) frontend.  This package gives direct access to the debugger
client without having to start up the server.

[1]:https://github.com/node-inspector/node-inspector

# Install

`npm install debugger-api`

# Example

```javascript
var DebuggerApi = require('debugger-api');

// make sure node is running in debug mode: node --debug-brk=5000
// then:
var dbugger = new DebuggerApi({debugPort: 5000});

// enable debugging.
dbugger.enable();

// initial breakpoint (because of debug-brk)
dbugger.once('Debugger.paused', function(firstBreak) {

  var scriptId = firstBreak.callFrames[0].location.scriptId,
      url = dbugger.scripts.findScriptByID(scriptId).url;

  dbugger.setBreakpointByUrl({
    url: url,
    lineNumber: 4
  });
  
  dbugger.on('Debugger.paused', function (pausedResult) {
    console.log(pausedResult);
  });
});
```

Output:

```javascript
{ callFrames:
   [ { callFrameId: '0',
       functionName: '',
       location: { scriptId: '46', lineNumber: 4, columnNumber: 2 },
       scopeChain: [ [Object], [Object] ],
       this:
        { type: 'object',
          subtype: undefined,
          objectId: '1',
          className: 'Object',
          description: 'Object' } },
     { callFrameId: '1',
       functionName: 'Module._compile',
       location: { scriptId: '36', lineNumber: 455, columnNumber: 25 },
       scopeChain: [ [Object], [Object], [Object] ],
       this:
        { type: 'object',
          subtype: undefined,
          objectId: '7',
          className: 'Object',
          description: 'Object' } },
      ...
    ],
  reason: 'other',
  data: null,
  hitBreakpoints: [ 2 ] }

```


See the tests for more.


# API

The returned object exposes the same methods as node-inspector's [`DebuggerAgent`][3], but
inherits from `EventEmitter` and emits events (see below) rather than sending signals to
a frontend.

[3]:https://github.com/node-inspector/node-inspector/blob/00e0d20a5dcdf3f1d56efb10b9630721b2e72c52/lib/DebuggerAgent.js

# Properties:

`scripts`

A node-inspector [`ScriptManager`][2] instance.

[2]:https://github.com/node-inspector/node-inspector/blob/00e0d20a5dcdf3f1d56efb10b9630721b2e72c52/lib/ScriptManager.js

# Methods:

## `enable(null, function(error, result))`

Enable debugging.

## `disable(null, function(error, result))`

Disable debugging.

## `pause(null, function(error, result))`

Pause execution.

## `resume(null, function(error, result))`

Resume execution.
Emits `Debugger.resumed`

## `stepOver(null, function(error, result))`

Step over current line.
Emits `Debugger.resumed`

## `stepInto(null, function(error, result))`

Step into current line, creating a new call frame.
Emits `Debugger.resumed`

## `stepOut(null, function(error, result))`

Step out of current call frame.
Emits `Debugger.resumed`

## `continueToLocation({location: location}, function(error, result))`

**NOTE: this appears to be broken at the moment.  Need to research
the underlying `node-inspector` code.**

`location` is in the form `{scriptId, lineNumber, columnNumber}`.
Emits `Debugger.resumed`

## `getScriptSource({scriptId: scriptId}, function(error, result))`

Get the script source by `scriptId`.  See also [`ScriptManager`][2], available as `scripts`.
`result` is  `{scriptSource: source}`

## `setScriptSource({scriptId: id, scriptSource: source}, function(error, result))`

Set the script source (even mid-execution!).  
`result` is `{callFrames: [...], result: result}`
TODO: what is `result`?

## `setPauseOnExceptions({state: 'all' | 'uncaught'}, function(error, result))`

TODO: cb(?)

## `setBreakpointByUrl(params, function(error, result))`

Set a breakpoint.
```
params = {url: scriptUrl,
          lineNumber: line number,
          columnNumber: column number,
          condition: stop condition}
```
`reponse` is `{breakpointId: id, locations: [...]}`

## `removeBreakpoint({breakpointId: id}, function(error, result))`

Remove a breakpoint based on breakpointId.
TODO: expose a way to query current list of breakpoints.

## `setBreakpointsActive({active: boolean}, function(error, result))`

Toggle breakpoints.

## `evaluateOnCallFrame({expression: string, callFrameId: frameId}, function(error, result))`

Eval the given expression in the context of a specific call frame.
`result` is `{result: inspectorResult | errorMessage, wasThrown: boolean }`

## `getFunctionDetails({functionId: id}, function(error, result))`

`result` is a function details object.

## `restartFrame({callFrameId: id}, function(error, result))`

Restart execution of the given call frame.
`result` is `{callFrames: [...], result: result}`
TODO: what is `result`?

## `setVariableValue(params, function(error, result))`

Set variable value.  Might not be supported, depending on V8 build/version.
```
params = {variableName, newValue, scopeNumber, callFrameId}
```
TODO: what is `result`?

# license

MIT
