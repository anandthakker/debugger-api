var DebuggerApi = require('./');

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
