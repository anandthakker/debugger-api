var test = require('./test-harness');

test('stepInto', __dirname + '/data/simple_program.js',
function(t, dbugger, child, done) {

  t.plan(2);

  dbugger.enable({}, function(){});
  dbugger.once('Debugger.paused', test_stepInto);
  
  function test_stepInto(firstBreak) {
    dbugger.stepInto({}, function(error, result){});

    dbugger.on('Debugger.resumed', function (result) {
      t.ok(true, 'resume event');
    });
    
    dbugger.on('Debugger.paused', function (secondBreak) {
      t.deepEqual(secondBreak.callFrames[1].location, firstBreak.callFrames[0].location,
        'pushes original call frame down the stack');
      done();
    });
  }
});
