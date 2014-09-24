var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    inspect = require('util').inspect;


function FakeSocket() {}

inherits(FakeSocket, EventEmitter);

FakeSocket.prototype.send = function(msg) {
  console.log('debugger message:\n', JSON.parse(msg));
};

module.exports = FakeSocket;
