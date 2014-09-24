var spawn = require('child_process').spawn,
    tape = require('tape'),
    DebuggerApi = require('../');

module.exports = test;

function test(name, srcForDebug, testFn) {
  var childprocess = spawn('node', ['--debug-brk=5000', srcForDebug]);
  var dbugger;
  
  var timeout;
  var done = function() {
    childprocess.kill();
    dbugger.close();
    if(timeout)
      clearTimeout(timeout);
  };
  
  // node debug message shows up on stderr... wait for that before attaching.
  childprocess.stderr.once('data', function(data) {
    dbugger = new DebuggerApi({debugPort: 5000});
    tape(name, function(t) {
      testFn(t, dbugger, childprocess, done);
    });
  });
  
  timeout = setTimeout(done, 10000);
}
