# node-inspector-api

A thin adapter that gives direct access to [node-inspector][1]'s backend.

Normally, node-inspector is acting both as a *client*--to a process run with `node --debug`--and
also as a *server*--serving up a web(kit) frontend.  This package gives direct access to the debugger
client without having to start up the server.

[1]:https://github.com/node-inspector/node-inspector

# example

...


# API

The returned object exposes the same methods as node-inspector's [`DebuggerAgent`][3], but
inherits from `EventEmitter` and emits events (see below) rather than sending signals to
a frontend.

[3]:https://github.com/node-inspector/node-inspector/blob/00e0d20a5dcdf3f1d56efb10b9630721b2e72c52/lib/DebuggerAgent.js

## Properties:

### `scripts`

A node-inspector [`ScriptManager`][2] instance.

[2]:https://github.com/node-inspector/node-inspector/blob/00e0d20a5dcdf3f1d56efb10b9630721b2e72c52/lib/ScriptManager.js

## Methods:

### `enable(null, function(error, result))`

### `disable(null, function(error, result))`

### `pause(null, function(error, result))`

### `resume(null, function(error, result))`

Emits `Debugger.resumed`

### `stepOver(null, function(error, result))`

Emits `Debugger.resumed`

### `stepInto(null, function(error, result))`

Emits `Debugger.resumed`

### `stepOut(null, function(error, result))`

Emits `Debugger.resumed`

### `continueToLocation({location: location}, function(error, result))`

`location` is in the form `{scriptId, lineNumber, columnNumber}`.

Emits `Debugger.resumed`

### `getScriptSource({scriptId: scriptId}, function(error, result))`

`result` is  `{scriptSource: source}`

### `setScriptSource({scriptId: id, scriptSource: source}, function(error, result))`

`result` is `{callFrames: [...], result: result}`
TODO: what is `result`?

### `setPauseOnExceptions({state: 'all' | 'uncaught'}, function(error, result))`

TODO: cb(?)

### `setBreakpointByUrl(params, function(error, result))`
```
params = {url: scriptUrl,
          lineNumber: line number,
          columnNumber: column number,
          condition: stop condition}
```

`reponse` is `{breakpointId: id, locations: [...]}`

### `removeBreakpoint({breakpointId: id}, function(error, result))`

### `setBreakpointsActive({active: boolean}, function(error, result))`

### `evaluateOnCallFrame({expression: string, callFrameId: frameId}, function(error, result))`

`result` is `{result: inspectorResult | errorMessage, wasThrown: boolean }`

### `getFunctionDetails({functionId: id}, function(error, result))`

`result` is a function details object.

### `restartFrame({callFrameId: id}, function(error, result))`

`result` is `{callFrames: [...], result: result}`
TODO: what is `result`?

### `setVariableValue(params, function(error, result))`
```
params = {variableName, newValue, scopeNumber, callFrameId}
```
TODO: what is `result`?


# install

# license

MIT
