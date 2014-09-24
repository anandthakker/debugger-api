var test = require('./test-harness');

test('initial connect', __dirname + '/data/simple_program.js',
function(t, dbugger, child, done) {
  t.plan(1);
  dbugger.enable({}, function(){});
  dbugger.once('Debugger.paused', function(params) {
    t.ok(true);
    done();
  });
});


// test('get parsed script info back', __dirname + '/data/simple_program.js',
// function(t, dbugger) {
//   t.plan(1);
//
//   dbugger.resume();
//   dbugger.on('Debugger.scriptParsed', function (params) {
//     if(typeof params.url === 'string' && params.url.indexOf('simple_program.js') > 0) {
//       t.ok(true);
//     }
//   });
// });
//
//
// test('set a breakpoint', __dirname + '/data/simple_program.js',
// function(t, dbugger) {
//   t.plan(2);
//
//   //TODO: change this to use the scriptmanager directly.
//   dbugger.on('Debugger.scriptParsed', function (params) {
//     if(typeof params.url === 'string' && params.url.indexOf('simple_program.js') > 0) {
//       dbugger.setBreakpointByUrl({
//         lineNumber: 4,
//         url: params.url
//       }, function(error, result) {
//         t.ok(result.breakpointId);
//         t.ok(result.locations);
//       });
//     }
//   });
//
//   dbugger.on('Debugger.paused', function(params) {
//     dbugger.resume();
//   });
//
// });
