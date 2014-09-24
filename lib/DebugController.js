var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    extend = require('util')._extend,
    path = require('path'),
    Session = require('node-inspector/lib/session'),
    FakeSocket = require('./FakeSocket');


inherits(DebugController, EventEmitter);

function DebugController(options) {
  this._config = extend({
    debugPort: 5858
  }, options);
  
  // shimming this in place of the websocket connection that talks to the
  // webkit debugger frontend.
  this._conn = new FakeSocket();
  this.messageId = 0;
  
  this._conn.on('Console.messageAdded', function handleConsoleMessage(err) {
    this.emit('error', err);
  });
}

DebugController.prototype.connect = function() {
  this._createSession(parseInt(this._config.debugPort, 10)).join(this._conn);
};

DebugController.prototype.invoke = function (method) {
  var params = arguments ? Array.prototype.slice.call(arguments) : [];
  this.conn.emit('message', JSON.stringify({
    'id':this.messageId++,
    'method':method,
    'params':params
    })
  );
};

DebugController.prototype.close = function() {
  this.emit('close');
};

DebugController.prototype._createSession = function(debugPort) {
  return Session.create(debugPort, this._config);
};

module.exports = DebugController;
