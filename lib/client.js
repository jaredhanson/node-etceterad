var request = require('request');

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

Client.prototype.set = function(path, data, options, cb) {
  var callb = cb
    , toSend;
  if (cb === undefined) {
    if (options === undefined) {
      callb = data;
      toSend = {dir: true}
    } else {
      callb = options
      toSend = {value : data};
    }
  } else {
    toSend = options;
    path = pathifier(path, options);
    toSend.value = data;
  }
  request.put(this.url + path, function (err, resp, body) {
    if (err) {
      return callb(err);
    }

    if (body.errorCode) {
      return callb(body);
    }

    return callb(null, body);
  }).form(toSend);
};

Client.prototype.post = function(path, data, options, cb) {
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

    path = pathifier(path, options);
    // Set all the querystring stuff
    toSend.value = data;
  }
  request.post(this.url + path, function (err, resp, body) {
    if (err) {
      return callb(err);
    }
    
    if (body.errorCode) {
      return callb(body);
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
      return cb(err);
    }

    if (body.errorCode) {
      return cb(body);
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
      return cb(err);
    }

    if (body.errorCode) {
      return cb(body);
    }

    return cb(null, body);
  });
};


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