var test = require('./test-harness'),
    extend = require('util')._extend;

// test('continueToLocation', __dirname + '/data/simple_program.js',
// function(t, dbugger, child, done) {
  
  //TODO: continueToLocation doesn't seem to work... needs research.

  // t.plan(2);
  //
  // dbugger.enable({}, function(){});
  // dbugger.once('Debugger.paused', test_continueToLocation);
  //
  // function test_continueToLocation(firstBreak) {
  //   var loc = extend({},firstBreak.callFrames[0].location);
  //   loc.lineNumber = 4;
  //   dbugger.continueToLocation({location: loc}, function(error, result){
  //     if(error) {
  //       t.fail(error);
  //     }
  //     dbugger.resume();
  //   });
  //
  //   dbugger.on('Debugger.resumed', function (resumeResult) {
  //     t.ok(true, 'resumed');
  //   });
  //
  //   dbugger.on('Debugger.paused', function (pausedResult) {
  //     t.deepEqual(pausedResult.callFrames[0].location, loc,
  //       'pauses at given location');
  //
  //     done();
  //   });
  // }
// });
