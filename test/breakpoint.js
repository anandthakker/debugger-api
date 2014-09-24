var test = require('./test-harness'),
    extend = require('util')._extend;

test('breakpoint', __dirname + '/data/simple_program.js',
function(t, dbugger, child, done) {

  t.plan(6);

  dbugger.enable({}, function(){});
  dbugger.once('Debugger.paused', test_breakpoint);
  
  function test_breakpoint(firstBreak) {
    var scriptId = firstBreak.callFrames[0].location.scriptId,
        url = dbugger.scripts.findScriptByID(scriptId).url,
        lineToBreak = 4;
    dbugger.setBreakpointByUrl({
      url: url,
      lineNumber: lineToBreak
    }, function(error, result){
      t.ok(result.breakpointId, 'breakpoint id');
      t.equal(result.locations[0].scriptId, scriptId, 'breakpoint set in correct script');
      t.equal(result.locations[0].lineNumber, lineToBreak, 'breakpoint set at correct line number');
      dbugger.resume();
    });
    
    dbugger.on('Debugger.resumed', function (resumeResult) {
      t.ok(true, 'resumed');
    });
    
    dbugger.on('Debugger.paused', function (pausedResult) {
      t.equal(pausedResult.callFrames[0].location.scriptId, scriptId,
        'break in correct script');
      t.equal(pausedResult.callFrames[0].location.lineNumber, lineToBreak,
        'break at correct line number');
      done();
    });
  }
});
