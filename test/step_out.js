var test = require('./test-harness.js');

test('stepOut', __dirname + '/data/simple_program.js',
function(t, dbugger, child, done) {

  t.plan(3);

  dbugger.enable({}, function(){});
  dbugger.once('Debugger.paused', test_stepOut);
  
  function test_stepOut(firstBreak) {
    dbugger.stepOut({}, function(error, result){});
    
    dbugger.on('Debugger.resumed', function (err, result) {
      t.ok(true, 'resumed');
    });
    
    dbugger.on('Debugger.paused', function (secondBreak) {
      var origLocationInNextFrame = firstBreak.callFrames[1].location;
      var locationAfterStepOut = secondBreak.callFrames[0].location;
      
      t.equal(locationAfterStepOut.scriptId, origLocationInNextFrame.scriptId,
        'steps out to script one below in call stack');
      t.ok(locationAfterStepOut.lineNumber >= origLocationInNextFrame.lineNumber,
        'reasonable line number after stepping out');
      done();
    });

  }
});
