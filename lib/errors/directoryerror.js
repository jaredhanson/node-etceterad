/**
 * `DirectoryError` error.
 *
 * @constructor
 * @param {String} [message]
 * @api public
 */
function DirectoryError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'DirectoryError';
  this.message = message || code;
  this.code = code || 'EDIRECTORY';
}

/**
 * Inherit from `Error`.
 */
DirectoryError.prototype.__proto__ = Error.prototype;


/**
 * Expose `DirectoryError`.
 */
module.exports = DirectoryError;
    