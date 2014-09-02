/* DEPENDANCIES */

var request = require('request');
var moment = require('moment');
var EtcdError = require('./errors/etcderror');
var DirectoryError = require('./errors/directoryerror');
var debug = require('debug')('etceterad');


/* CONSTRUCTOR */

function Client(options) {
  options = options || {};

  var host = options.host || 'localhost';
  var port = options.port || '4001';
  var root = options.root || '/v2/keys';

  if (typeof options === 'string') {
    this._url = options;
  }
  
  // HTTP for etcd's interface.
  this._url = this._url || 'http://' + host + ':' + port + root;
}

/* PUBLIC METHODS */

Client.prototype.setPath = function(path, cb) {
  this._set(path, null, { dir: true, dirOptions: true}, function (err, result) {
    if (err) {
      return cb(err);
    }

    if (result.errorCode) {
      var thisError = new Error(result.message + ", cause: " + result.cause);
      thisError.code = result.errorCode;
      return cb(thisError)
    }
    
    return cb();
  });
};

Client.prototype.getPath = function getPath(path, cb) {
  this._get(path, function (err, result) {
    var resultNodes;
    if (err) {
      return cb(err);
    }

    // TODO: Individual Errors
    if (! (result.node && result.node.dir)) {
      return cb(new DirectoryError());
    }
    resultNodes = (result.node && result.node.nodes) ? result.node.nodes : [];
    var results = [];
    var values = {};
    for (var i = 0, len = resultNodes.length; i < len; i++) {
      results.push(resultNodes[i].key);
      values[resultNodes[i].key] = resultNodes[i].value;
    }
    return cb(null, results, values);
  });
};

// TODO: Proper handling of errors
Client.prototype.deletePath = function deletePath(path, cb) {
  this._delete(path, {dir: true}, function (err, result) {
    if (err) {
      return cb(err);
    }

    return cb();
  });
};

Client.prototype.setValue = function setValue(path, value, cb) {
  this._set(path, value, function (err, result) {
    if (err) {
      return cb(err);
    }

    if (result.errorCode) {
      var thisError = new Error(result.message + ", cause: " + result.cause);
      thisError.code = result.errorCode;
      return cb(thisError)
    }

    return cb();
  });
};

// TODO: Two different Directory Errors
Client.prototype.getValue = function getValue(path, cb) {
  this._get(path, function (err, result) {
    if (err) {
      return cb(err);
    }

    if (result.node && result.node.dir) {
      return cb(new DirectoryError());
    }

    return cb(null, result.node.value, result.node.ttl);
  });
};

Client.prototype.deleteValue = function deleteValue(path, cb) {
  this._delete(path, function (err, result) {
    if (err) {
      return cb(err);
    }

    return cb();
  });
};

Client.prototype.setTTL = function setTTL(path, value, ms, cb) {
  if (cb === undefined) {
    cb = ms;
    ms = value;
    value = null;
  }
  this._set(path, value, {ttl: ms}, function (err, result) {
    if (err) {
      return cb(err);
    }

    if (result.errorCode) {
      var thisError = new Error(result.message + ", cause: " + result.cause);
      thisError.code = result.errorCode;
      return cb(thisError)
    }

    return cb();
  });
};

Client.prototype.updateTTL = function setTTL(path, value, ms, cb) {
  if (cb === undefined) {
    cb = ms;
    ms = value;
    value = null;
  }
  this._set(path, value, {ttl: ms, prevExist: true}, function (err, result) {
    if (err) {
      return cb(err);
    }

    if (result.errorCode) {
      var thisError = new Error(result.message + ", cause: " + result.cause);
      thisError.code = result.errorCode;
      return cb(thisError)
    }

    return cb();
  });
};

Client.prototype.watch = function(path, options, cb) {
  if (cb === undefined) {
    cb = options;
    options = null;
  }
  options = options || {};
  options.wait = true;
  
  this._get(path, options, function(err, result) {
    if (err) { return cb(err); }
    
    var stats = {};
    stats.mindex = result.node.modifiedIndex;
    
    // TODO: Make a "stats" object and parse the expiration time with moment.
    return cb(null, result.action, result.node.key, result.node.value, stats);
  });
}

/* PRIVATE METHODS */

Client.prototype._get = function(path, options, cb) {
  if (cb === undefined) {
    // We have no options.
    cb  = options;
  } else {
    path = _pathifier(path, options);
  }

  var url = this._url + path;
  debug('GET %s', url);
  request(url, function (err, resp, body) {

    if (err) {
      return cb(err);
    }

    debug('%d %s data=%s', resp.statusCode, url, body);
    try {
      body = JSON.parse(body);
    } catch (_) {
      return cb(new Error('Failed to parse response as JSON'));
    }

    if (body.errorCode) {
      return cb(new EtcdError(body.message, body.errorCode, body.cause));
    }
    return cb(null, body);
  });
};

Client.prototype._set = function(path, data, options, cb) {
  if (cb === undefined) {
    // We have no options.
    cb = options;
    options = null;
  }
  options = options || {};
  var path = _pathifier(path, options);
  var toSend = options;
  if (data !== null) {
    toSend.value = data;
  }
  
  var url = this._url + path;
  debug('PUT %s data=%s', url, JSON.stringify(toSend));
  request.put(url, function (err, resp, body) {
    if (err) {
      return cb(err);
    }

    debug('%d %s data=%s', resp.statusCode, url, body);
    try {
      body = JSON.parse(body);
    } catch (_) {
      return cb(new Error('Failed to parse response as JSON'));
    }
    return cb(null, body);
  }).form(toSend);
};

// TODO: Better errors on bad deletes i.e. deleteValue on non-existent path.
Client.prototype._delete = function(path, options, cb) {
  if (cb === undefined) {
    // We have no options.
    cb = options;
    options = null;
  } else {
    path = _pathifier(path, options);
  }
  request.del(this._url + path, function (err, resp, body) {
  
  var url = this._url + path;
  debug('DELETE %s', url);
  request.del(url, function (err, resp, body) {
    if (err) {
      return cb(err);
    }

    debug('%d %s data=%s', resp.statusCode, url, body);
    try {
      body = JSON.parse(body);
    } catch (_) {
      return cb(new Error('Failed to parse response as JSON'));
    }

    if (body.errorCode) {
      return cb(new EtcdError(body.message, body.errorCode, body.cause));
    }
    return cb(null, body);
  });
};

// Pathifier runs through the options and sets the query string properly.
// If the thing is a dir set, and dir is NOT going in the query string,
// dirOptions should be set to true in the options
function _pathifier(path, options) {
  var set = false;
  var opts = Object.keys(options);
  for (var i = opts.length - 1; i >= 0; i--) {
    // TTL does not belong in the query string, DIR does, if dirOptions is not set.
    // dirOptions is a meta option and should not go anywhere after pathifier finishes.
    if (! (opts[i] === 'ttl' || (opts[i] === 'dirOptions') || (opts[i] === 'dir' && options.dirOptions))) {
      if (! set) {
        path += '?';
        set = true;
      } else {
        path += '&';
      }
      path += opts[i] + '=' + options[opts[i]];
      // In query string now, not options
      delete options[opts[i]];
    }
  };
  if (options.dirOptions) {
    delete options.dirOptions;
  }
  return path;
}

module.exports = Client;