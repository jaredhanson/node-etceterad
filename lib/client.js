var request = require('request');

function Client(options) {
  options = options || {};
  this.host = options.host || 'localhost';
  this.port = options.port || '4001';
  this.prefix = options.prefix || '/v2/keys/';
  // HTTP for etcd's interface.
  this.url = 'http://' + this.host + ':' + this.port + this.prefix;
}

Client.prototype.set = function(path, data, options, cb) {
  var callb = cb
    , toSend;
  if (cb === undefined) {
    if (options === undefined) {
      var callb = data;
      toSend = {dir: true}
    } else {
      var callb = options
      toSend = {value : data};
    }
  } else {
    toSend = options;
    path = pathifier(path, options);
    options.value = data;
  }
  request.put(this.url + path, function (err, resp, body) {
    if (err) {
      return _ErrorMaker(err, callb);
    }
    try {
      body = JSON.parse(body)
    } catch (ex) {
      body;
    }
    return callb(null, body);
  }).form(toSend);
};

Client.prototype.post = function(path, data, options, cb) {
  var callb = cb
    , toSend;
  if (cb === undefined) {
    if (options === undefined) {
      var callb = data;
      toSend = {dir: true}
    } else {
      var callb = options
      toSend = {value : data};
    }
  } else {
    toSend = options;
    path = pathifier(path, options);
    options.value = data;
  }
  request.post(this.url + path, function (err, resp, body) {
    if (err) {
      return _ErrorMaker(err, callb);
    }
    try {
      body = JSON.parse(body)
    } catch (ex) {
      body;
    }
    return callb(null, body);
  }).form(toSend);
};

Client.prototype.delete = function(path, options, cb) {
  if (cb === undefined) {
    // We have no options.
    cb = options;
  } else {
    path = pathifier(path, options);
  }
  request.del(this.url + path, function (err, resp, body) {
    if (err) {
      return _ErrorMaker(err, cb);
    }
    try {
      body = JSON.parse(body)
    } catch (ex) {
      body;
    }
    return cb(null, body);
  });
};

Client.prototype.get = function(path, options, cb) {
  if (cb === undefined) {
    // We have no options.
    cb  = options;
  } else {
    path = pathifier(path, options);
  }
  request(this.url + path, function (err, resp, body) {
    if (err) {
      return _ErrorMaker(err, cb);
    }
    try {
      body = JSON.parse(body)
    } catch (ex) {
      body;
    }
    if (body.errorCode) {
      return cb(body);
    }
    return cb(null, body);
  });
};

function _ErrorMaker(error, cb) {
  error.msg = "Etcd Connection Error: " + error.msg;
  return cb(error);
}

// Pathifier runs through the options and sets the query string properly.
function pathifier(path, options) {
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