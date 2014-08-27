/* DEPENDANCIES */

var request = require('request');
var DirectoryError = require('./errors/directoryerror');


/* CONSTRUCTOR */

function Client(options) {
  options = options || {};

  if (typeof options === 'string') {
    this.url = options;
  } else {
    this.host = options.host || 'localhost';
    this.port = options.port || '4001';
    this.prefix = options.prefix || '/v2/keys/';
  }
  // HTTP for etcd's interface.
  this.url = this.url || 'http://' + this.host + ':' + this.port + this.prefix;
}

/* PUBLIC METHODS */

Client.prototype.setPath = function(path, cb) {
  this._set(path, function (err, result) {
    if (err) {
      return cb(err);
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

    if (result.errorCode) {
      return cb(result)
    }

    if (! (result.node && result.node.dir)) {
      return cb(new DirectoryError());
    }
    resultNodes = (result.node && result.node.nodes) ? result.node.nodes : [];
    var results = [];
    for (var i = 0, len = resultNodes.length; i < len; i++) {
      results.push(resultNodes[i]['key']);
    }
    return cb(null, results);
  });
};

Client.prototype.deletePath = function deletePath(path, cb) {
  this._delete(path, {recursive: true}, function (err, result) {
    if (err) {
      return cb(err);
    }

    return cb();

  });
}
Client.prototype.setValue = function setValue(path, value, cb) {
  this._set(path, value, function (err, result) {
    if (err) {
      return cb(err);
    }

    if (result.errorCode) {
      return cb(result)
    }

    return cb();
  });
};

Client.prototype.getValue = function getValue(path, cb) {
  this._get(path, function (err, result) {
    if (err) {
      return cb(err);
    }

    if (result.errorCode) {
      return cb(result)
    }

    // if (result.dir)

    return cb(null, result);
  });
};

Client.prototype.deleteValue = function deleteValue(path, value, cb) {
  this._delete(path, {prevValue: value}, function (err, result) {
    if (err) {
      return cb(err);
    }

    if (result.errorCode) {
      return cb(result)
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
    return cb();
  });
};

/* PRIVATE METHODS */

Client.prototype._get = function(path, options, cb) {
  if (cb === undefined) {
    // We have no options.
    cb  = options;
  } else {
    path = _pathifier(path, options);
  }
  request(this.url + path, function (err, resp, body) {

    if (err) {
      return cb(err);
    }

    try {
      body = JSON.parse(body);
    } catch (_) {}

    return cb(null, body);
  });
};

Client.prototype._set = function(path, data, options, cb) {
  var callb = cb
    , toSend;
  if (cb === undefined) {
    if (options === undefined) {
      callb = data;
      toSend = {dir: true}
    } else {
      callb = options
      if (! value === null) {
        toSend = {value : data};
      }
    }
  } else {
    toSend = options;
    path = _pathifier(path, options);
    if (! value === null) {
      toSend.value = data;
    }
  }
  request.put(this.url + path, function (err, resp, body) {
    if (err) {
      return callb(err);
    }

    try {
      body = JSON.parse(body);
    } catch (_) {}

    return callb(null, body);

  }).form(toSend);
};

Client.prototype._post = function(path, data, options, cb) {
  var callb = cb
    , toSend;
  if (cb === undefined) {
  // cb is not there
    if (options === undefined) {
    // options are not there
      callb = data;
      // Then callback must be data
      toSend = {dir: true}
      // Since we don't have data, this must be a path
    } else {
      // We have options so, callback must be that
      callb = options
      toSend = {value : data};
    }
  } else {
    // We have it all
    toSend = options;

    path = _pathifier(path, options);
    // Set all the querystring stuff
    toSend.value = data;
  }
  request.post(this.url + path, function (err, resp, body) {
    if (err) {
      return callb(err);
    }

    try {
      body = JSON.parse(body);
    } catch (_) {}

    return callb(null, body);

  }).form(toSend);
};

Client.prototype._delete = function(path, options, cb) {
  if (cb === undefined) {
    // We have no options.
    cb = options;
  } else {
    path = _pathifier(path, options);
  }
  request.del(this.url + path, function (err, resp, body) {
    if (err) {
      return cb(err);
    }

    try {
      body = JSON.parse(body);
    } catch (_) {}

    return cb(null, body);
  });
};

// Pathifier runs through the options and sets the query string properly.
function _pathifier(path, options) {
  var set = false;
  var opts = Object.keys(options);
  for (var i = opts.length - 1; i >= 0; i--) {
    // TTL and DIR go in a form, not in the query string
    if (! (options[i] === 'ttl' || options[i] === 'dir')) {
      if (! set) {
        path += '?';
        set = true;
      } else {
        path += '&';
      }
      path += opts[i] + '=' + options[opts[i]];
    }
  };
  return path;
}

module.exports = Client;