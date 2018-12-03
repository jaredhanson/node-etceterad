var CLIENT_PATH = '../../lib/client';

var sinon = require('sinon')
  , Client = require('../lib/client')
  , clientPath = '../../lib/client';
  
describe('Client', function () {
  
  it('should export a constructor', function () {
    expect(Client).to.be.a('function');
  });
  
  describe('#getPath', function () {
    
    it('should be a function', function () {
      var client = new Client();
      expect(client.getPath).to.be.a('function');
    });
    
    it('should do something', function(done) {
      var client = new Client();
      expect(1).to.equal(1);
      
      var request = sinon.stub().yields(null, {}, JSON.parse('{"node": {"dir": true, "nodes": [{"key": "wow", "value": "niceone"}]}}'));
      
      /*
      var request = function(options, cb) {
        //expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"node": {"dir": true, "nodes": [{"key": "wow", "value": "niceone"}]}}');
        });
      };
      */
      
      var client = $require(clientPath, {'request': request});
      var myClient = new client();
      myClient.getPath('/welcome/to/the/party', function (err, res) {
        if (err) { return done(err); }
        response = res;
        
        
        expect(request).to.have.been.calledOnce;
        expect(request).to.have.been.calledWith({
          url: 'http://localhost:4001/v2/keys/welcome/to/the/party',
          json: true,
          pool: { maxSockets: 9999 }
        });
        
        expect(response[0]).to.be.equal('wow');
        
        return done();
      });
      
      
      //done();
    });
    
    /*
    describe('correctly getting path', function () {
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      };

      var request = function(options, cb) {
        //expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"node": {"dir": true, "nodes": [{"key": "wow", "value": "niceone"}]}}');
        });
        return result;
      };

      var response;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getPath('/welcome/to/the/party', function (err, res) {
          if (err) { return done(err); }
          response = res;
          return done();
        });
      });

      it('should not receive options', function () {
        expect(opts).to.be.undefined;
      });

      it('should return path', function () {
        expect(response[0]).to.be.equal('wow');
      });
    });
    */
    
  });
  

  /*
  describe('#setPath', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.setPath).to.be.a('function');
    });

    describe('correctly setting path', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.put = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{}');
        });
        return result;
      };

      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.setPath('/welcome/to/the/party', function (err) {
          if (err) { return done(err); }
          return done();
        });
      });

      it('should receive options', function () {
        expect(opts).to.not.undefined;
        expect(Object.keys(opts).length).to.equal(1);
        expect(opts.dir).to.be.true;
      });
    });

    describe('error at request level', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.put = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(new Error('Hi, my name is error, and I am and Error'));
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.setPath('/welcome/to/the/party', function (err) {
          if (err) { 
            error = err;
            return done(); 
          }
        });
      });
      it('should receive an error', function () {
        expect(error).to.not.undefined;
        expect(error.message).to.be.equal('Hi, my name is error, and I am and Error');
      });
    });

    describe('error at etcd level', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.put = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"errorCode": 100, "message": "Hi, my name is error, and I am and Error", "cause": "test"}');
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.setPath('/welcome/to/the/party', function (err) {
          if (err) { 
            error = err;
            return done(); 
          }
        });
      });
      it('should receive an error', function () {
        expect(error).to.not.undefined;
        expect(error.message).to.be.equal('Hi, my name is error, and I am and Error');
        expect(error.cause).to.be.equal('test');
      });
    });
  });

  describe('#getPath', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.getPath).to.be.a('function');
    });

    describe('correctly getting path', function () {
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      };

      var request = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"node": {"dir": true, "nodes": [{"key": "wow", "value": "niceone"}]}}');
        });
        return result;
      };

      var response;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getPath('/welcome/to/the/party', function (err, res) {
          if (err) { return done(err); }
          response = res;
          return done();
        });
      });

      it('should not receive options', function () {
        expect(opts).to.be.undefined;
      });

      it('should return path', function () {
        expect(response[0]).to.be.equal('wow');
      });
    });
    
    describe('error at request level', function () {
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      var request = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(new Error('Hi, my name is error, and I am and Error'));
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getPath('/welcome/to/the/party', function (err) {
          if (err) { 
            error = err;
            return done(); 
          }
        });
      });
      it('should receive an error', function () {
        expect(error).to.not.undefined;
        expect(error.message).to.be.equal('Hi, my name is error, and I am and Error');
      });
    });

    describe('error at etcd level', function () {
      var opts;
      var result = {};
      result.form = function (options) {
        opts = options;
      }
      var request = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"errorCode": 100, "message": "Hi, my name is error, and I am and Error", "cause": "test"}');
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getPath('/welcome/to/the/party', function (err) {
          if (err) { 
            error = err;
            return done(); 
          }
        });
      });

      it('should receive an error', function () {
        expect(error).to.not.undefined;
        expect(error.message).to.be.equal('Hi, my name is error, and I am and Error');
        expect(error.cause).to.be.equal('test');
      });
    });
    
    describe('directory error', function () {
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      };

      var request = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"key": "wow", "value": "niceone"}');
        });
        return result;
      };

      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getPath('/welcome/to/the/party', function (err, res) {
          if (err) {
            error = err;
            return done();
          }
        });
      });
      it('should produce a directory error', function () {
        expect(error).to.not.be.undefined;
        expect(error.code).to.be.equal('EDIRECTORY');
      })

    });

  });

  describe('#deletePath', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.deletePath).to.be.a('function');
    });

    describe('correctly deleting path', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.del = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party?dir=true');
        process.nextTick(function() {
          return cb(null, {}, '{"node": {"dir": true, "nodes": [{"key": "wow", "value": "niceone"}]}}');
        });
        return result;
      };

      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.deletePath('/welcome/to/the/party', function (err, res) {
          if (err) { return done(err); }
          return done();
        });
      });

      it('should not receive options', function () {
        expect(opts).to.be.undefined;
      });
    });

    describe('error at request level', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.del = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party?dir=true');
        process.nextTick(function() {
          return cb(new Error('Delete Error'));
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.deletePath('/welcome/to/the/party', function (err, res) {
          if (err) {
            error = err;
            return done();
          }
        });
      });

      it('should produce an error', function () {
        expect(error).to.not.be.undefined;
        expect(error.message).to.be.equal('Delete Error');
      });
    });

    describe('error at etcd level', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.del = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party?dir=true');
        process.nextTick(function() {
          return cb(null, {}, '{"errorCode": 100, "message": "Error1", "cause": "test"}');
        });
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.deletePath('/welcome/to/the/party', function (err, res) {
          if (err) {
            error = err;
            return done();
          }
        });
      });

      it('should produce an error', function () {
        expect(error).to.not.be.undefined;
        expect(error.message).to.be.equal('Error1');
        expect(error.cause).to.be.equal('test');
      });
    });
  });

  describe('#setValue', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.setValue).to.be.a('function');
    });

    describe('correctly setting value', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.put = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{}');
        });
        return result;
      };

      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.setValue('/welcome/to/the/party', 'weew', function (err) {
          if (err) { return done(err); }
          return done();
        });
      });

      it('should set the value', function () {
        expect(opts.value).to.equal('weew');
      });
    });

    describe('error at request level', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.put = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(new Error('This is an error'));
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.setValue('/welcome/to/the/party', 'weew', function (err) {
          if (err) {
            error = err;
            return done();
          }
        });
      });

      it('should produce an error', function () {
        expect(error).to.not.be.undefined;
        expect(error.message).to.be.equal('This is an error');
      });
    });

    describe('error at etcd level', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.put = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"errorCode": 100, "message": "Error1", "cause": "test"}');
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.setValue('/welcome/to/the/party', 'weew', function (err) {
          if (err) {
            error = err;
            return done();
          }
        });
      });

      it('should produce an error', function () {
        expect(error).to.not.be.undefined;
        expect(error.message).to.be.equal('Error1');
        expect(error.cause).to.be.equal('test');
      });
    });

  });

  describe('#getValue', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.getValue).to.be.a('function');
    });

    describe('correctly getting value', function () {
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      var request = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"node": {"key": "party", "value": "good one"}}');
        });
        return result;
      };
      var response;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getValue('/welcome/to/the/party', function (err, res) {
          if (err) { return done(err); }
          response = res;
          return done();
        });
      });

      it('should return the value', function () {
        expect(response).to.be.equal('good one');
      });
    });

    describe('error at request level', function () {
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      var request = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(new Error('I am an error'));
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getValue('/welcome/to/the/party', function (err, res) {
          if (err) {
            error = err;
            return done();
          }
        });
      });
      it('should produce an error', function () {
        expect(error).to.not.be.undefined;
        expect(error.message).to.be.equal('I am an error');
      });
    });

    describe('error at etcd level', function () {
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      var request = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"errorCode": 100, "message": "Error1", "cause": "test"}');
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getValue('/welcome/to/the/party', function (err, res) {
          if (err) {
            error = err;
            return done();
          }
        });
      });

      it('should produce an error', function () {
        expect(error).to.not.be.undefined;
        expect(error.message).to.be.equal('Error1');
      });
    });

    describe('directory error', function () {
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      var request = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"node": {"dir": true, "nodes": [{"node": {"key": "party", "value": "good one"}}]}}');
        });
        return result;
      };
      var error;
      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.getValue('/welcome/to/the/party', function (err, res) {
          if (err) {
            error = err;
            return done();
          }
        });
      });

      it('should return a directory error', function () {
        expect(error.code).to.be.equal('EDIRECTORY');
      });
    })
  });

  describe('#deleteValue', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.deleteValue).to.be.a('function');
    });
    describe('it should correctly delete value', function () {
      var request = {};
      var result = {};
      var opts;
      result.form = function (options) {
        opts = options;
      }
      request.del = function(url, cb) {
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
        process.nextTick(function() {
          return cb(null, {}, '{"node": {"dir": true, "nodes": [{"key": "wow", "value": "niceone"}]}}');
        });
        return result;
      };

      before(function (done) {
        var client = $require(clientPath, {'request': request});
        var myClient = new client();
        myClient.deleteValue('/welcome/to/the/party', function (err, res) {
          if (err) { return done(err); }
          return done();
        });
      });

      it('should not receive options', function () {
        expect(opts).to.be.undefined;
      });
    });
  });

  describe('#setTTL', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.setTTL).to.be.a('function');
    });
  });

  describe('#updateTTL', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.updateTTL).to.be.a('function');
    });
  });
  */

});