var spawn = require('child_process').spawn,
    tape = require('tape'),
    DebuggerApi = require('../');

module.exports = test;

// yuck.
var nextPort = 5000;

function test(name, srcForDebug, testFn) {
  var port = nextPort++;
  var childprocess = spawn('node', ['--debug-brk='+port, srcForDebug]);
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
    dbugger = new DebuggerApi({debugPort: port});
    tape(name, function(t) {
      testFn(t, dbugger, childprocess, done);
    });
  });
  
  timeout = setTimeout(done, 10000);
}
