var debug = require('debug');
var DebugController = require('./lib/DebugController'),
    FakeSocket = require('./lib/FakeSocket');


debug.enable('node-inspector:protocol:devtools');

// main
var bugger = new DebugController();
bugger.on('error', function(error){
  console.error(error);
});


bugger.invoke('Debugger.enable');
bugger.invoke('Page.getResourceTree');

process.stdin.resume();

var paused = true;
process.stdin.on('data', function(data){
  if(paused)
    bugger.invoke('Debugger.resume');
  else
    bugger.invoke('Debugger.pause');
  paused = !paused;
});
