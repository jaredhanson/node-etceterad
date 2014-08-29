/**
 * `EtcdError` error.
 *
 * @constructor
 * @param {String} [message]
 * @api public
 */
function EtcdError(message, code, cause) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'EtcdError';
  this.message = message || code;
  this.code = code;
  this.cause = cause;
}

/**
 * Inherit from `Error`.
 */
EtcdError.prototype.__proto__ = Error.prototype;


/**
 * Expose `EtcdError`.
 */
module.exports = EtcdError;
