var inherits = require('util').inherits,
    NodeInspectorFrontendClient = require('node-inspector/lib/FrontendClient').FrontendClient;

inherits(FrontendClient, NodeInspectorFrontendClient);
function FrontendClient() {
  var self = this;
  if (!(this instanceof FrontendClient)) return new FrontendClient();

  // heads up: this constructor expects a 'connection' object.
  // trying to bypass by overriding all internal methods that use it.
  NodeInspectorFrontendClient.call(this);
}

Object.defineProperties(FrontendClient.prototype, {
  /** @type {boolean} */
  isConnected: {
    get: function() {
      return true;
    }
  }
});

FrontendClient.prototype._registerEventHandlers = function() {
  // noop.
};

/**
 * This is the override mentioned above in the constructor --
 * super's version of this is the only method that touches the
 * connection.  Instead, we're just gonna emit an event.
 */
FrontendClient.prototype._sendMessage = function(message) {
  this.emit('message', message);
};

exports.FrontendClient = FrontendClient;
