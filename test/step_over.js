var test = require('./test-harness');

test('stepOver', __dirname + '/data/simple_program.js',
function(t, dbugger, child, done) {

  t.plan(3);

  dbugger.enable({}, function(){});
  dbugger.once('Debugger.paused', test_stepover);
  
  function test_stepover(result) {
    dbugger.stepOver({}, function(error, result){});
    
    var loc = result.callFrames[0].location;
    dbugger.on('Debugger.resumed', function (result) {
      t.ok(true, 'resume event');
    });
    
    dbugger.on('Debugger.paused', function (result) {
      var newLocation = result.callFrames[0].location;
      t.equal(newLocation.lineNumber, loc.lineNumber+1, 'steps to next line');
      t.equal(newLocation.scriptId, loc.scriptId, 'stays in same script');
      done();
    });
  }
});
