var MODULE_PATH = '../lib/client';

var $require = require('proxyquire')
  , sinon = require('sinon')
  , Client = require(MODULE_PATH);
  
  
describe('Client', function () {
  
  it('should export a constructor', function () {
    expect(Client).to.be.a('function');
  });
  
  describe('#set', function () {
    var request = {
      put: function(){}
    };
    
    afterEach(function() {
      request.put.restore && request.put.restore();
    });
    
    
    it('should be a function', function () {
      var client = new Client();
      expect(client.set).to.be.a('function');
    });
    
    it('should set value', function(done) {
      var form = sinon.spy();
      sinon.stub(request, 'put').callsFake(function(options, cb) {
        process.nextTick(function() {
          return cb(null, {}, JSON.stringify({
            action: 'set',
            node: {
              key: '/message',
              value: 'Hello world',
              modifiedIndex: 2,
              createdIndex: 2
            }
          }));
        });
        
        return { form: form };
      });
      
      
      var Client = $require(MODULE_PATH, { 'request': request });
      var client = new Client();
      client.set('/message', 'Hello world', function (err, res) {
        if (err) { return done(err); }
        
        expect(request.put).to.have.been.calledOnce;
        expect(request.put).to.have.been.calledWith({
          url: 'http://localhost:4001/v2/keys/message',
          pool: { maxSockets: 9999 }
        });
        
        expect(form).to.have.been.calledOnce;
        expect(form).to.have.been.calledWith({ value: 'Hello world' });
        
        done();
      });
    });
    
    it('should set value with TTL', function(done) {
      var form = sinon.spy();
      sinon.stub(request, 'put').callsFake(function(options, cb) {
        process.nextTick(function() {
          return cb(null, {}, JSON.stringify({
            action: 'set',
            node: {
              key: '/message',
              value: 'Hello world',
              modifiedIndex: 2,
              createdIndex: 2
            }
          }));
        });
        
        return { form: form };
      });
      
      
      var Client = $require(MODULE_PATH, { 'request': request });
      var client = new Client();
      client.set('/foo', 'bar', { ttl: 5 }, function (err, res) {
        if (err) { return done(err); }
        
        expect(request.put).to.have.been.calledOnce;
        expect(request.put).to.have.been.calledWith({
          url: 'http://localhost:4001/v2/keys/foo',
          pool: { maxSockets: 9999 }
        });
        
        expect(form).to.have.been.calledOnce;
        expect(form).to.have.been.calledWith({ value: 'bar', ttl: 5 });
        
        done();
      });
    });
    
  }); // #set
  
  describe('#get', function () {
    
    it('should be a function', function () {
      var client = new Client();
      expect(client.get).to.be.a('function');
    });
    
    it('should get value', function(done) {
      var request = sinon.stub().yields(null, {}, JSON.stringify({
        action: 'get',
        node: {
          key: '/message',
          value: 'Hello world',
          modifiedIndex: 2,
          createdIndex: 2
        }
      }));
      
      var Client = $require(MODULE_PATH, { 'request': request });
      var client = new Client();
      client.get('/message', function (err, res) {
        if (err) { return done(err); }
        
        expect(request).to.have.been.calledOnce;
        expect(request).to.have.been.calledWith({
          url: 'http://localhost:4001/v2/keys/message',
          pool: { maxSockets: 9999 }
        });
        
        expect(res).to.equal('Hello world');
        
        done();
      });
    });
    
  }); // #get
  
  describe('#delete', function () {
    var request = {
      del: function(){}
    };
    
    afterEach(function() {
      request.del.restore && request.del.restore();
    });
    
    
    it('should be a function', function () {
      var client = new Client();
      expect(client.delete).to.be.a('function');
    });
    
    it('should delete key', function(done) {
      sinon.stub(request, 'del').yields(null, {}, JSON.stringify({
        action: 'delete',
        node: {
          key: '/message',
          modifiedIndex: 4,
          createdIndex: 3
        },
        prevNode: {
          key: '/message',
          value: 'Hello etcd',
          modifiedIndex: 3,
          createdIndex: 3
        }
      }));
      
      var Client = $require(MODULE_PATH, { 'request': request });
      var client = new Client();
      client.delete('/message', function (err, res) {
        if (err) { return done(err); }
        
        expect(request.del).to.have.been.calledOnce;
        expect(request.del).to.have.been.calledWith({
          url: 'http://localhost:4001/v2/keys/message',
          pool: { maxSockets: 9999 }
        });
        
        done();
      });
    });
    
  }); // #delete
  
  describe('#mkdir', function () {
    var request = {
      put: function(){}
    };
    
    afterEach(function() {
      request.put.restore && request.put.restore();
    });
    
    
    it('should be a function', function () {
      var client = new Client();
      expect(client.mkdir).to.be.a('function');
    });
    
    it('should create directory', function(done) {
      var form = sinon.spy();
      sinon.stub(request, 'put').callsFake(function(options, cb) {
        process.nextTick(function() {
          return cb(null, {}, JSON.stringify({
            action: 'set',
            node: {
              key: '/dir',
              dir: true,
              modifiedIndex: 30,
              createdIndex: 30
            }
          }));
        });
        
        return { form: form };
      });
      
      
      var Client = $require(MODULE_PATH, { 'request': request });
      var client = new Client();
      client.mkdir('/dir', function (err, res) {
        if (err) { return done(err); }
        
        expect(request.put).to.have.been.calledOnce;
        expect(request.put).to.have.been.calledWith({
          url: 'http://localhost:4001/v2/keys/dir',
          pool: { maxSockets: 9999 }
        });
        
        expect(form).to.have.been.calledOnce;
        expect(form).to.have.been.calledWith({ dir: true });
        
        done();
      });
    });
    
  }); // #mkdir
  
  describe('#readdir', function () {
    
    it('should be a function', function () {
      var client = new Client();
      expect(client.readdir).to.be.a('function');
    });
    
    it('should list directory', function(done) {
      var request = sinon.stub().yields(null, {}, JSON.stringify({
        action: 'get',
        node: {
          dir: true,
          nodes: [ {
            key: '/foo',
            value: 'two',
            modifiedIndex: 4,
            createdIndex: 4
          }, {
            key: '/foo_bar',
            dir: true,
            modifiedIndex: 5,
            createdIndex: 5
          } ],
        }
      }));
      
      var Client = $require(MODULE_PATH, { 'request': request });
      var client = new Client();
      client.readdir('/', function (err, res) {
        if (err) { return done(err); }
        
        expect(request).to.have.been.calledOnce;
        expect(request).to.have.been.calledWith({
          url: 'http://localhost:4001/v2/keys/',
          pool: { maxSockets: 9999 }
        });
        
        expect(res).to.have.length(2);
        expect(res[0]).to.be.equal('/foo');
        expect(res[1]).to.be.equal('/foo_bar');
        
        done();
      });
    });
    
  }); // #readdir
  
  describe('#rmdir', function () {
    var request = {
      del: function(){}
    };
    
    afterEach(function() {
      request.del.restore && request.del.restore();
    });
    
    
    it('should be a function', function () {
      var client = new Client();
      expect(client.delete).to.be.a('function');
    });
    
    it('should delete directory', function(done) {
      sinon.stub(request, 'del').yields(null, {}, JSON.stringify({
        action: 'delete',
        node: {
          key: '/foo_dir',
          dir: true,
          modifiedIndex: 31,
          createdIndex: 30
        },
        prevNode: {
          key: '/foo_dir',
          dir: true,
          modifiedIndex: 30,
          createdIndex: 30
        }
      }));
      
      var Client = $require(MODULE_PATH, { 'request': request });
      var client = new Client();
      client.deletePath('/foo_dir', function (err, res) {
        if (err) { return done(err); }
        
        expect(request.del).to.have.been.calledOnce;
        expect(request.del).to.have.been.calledWith({
          url: 'http://localhost:4001/v2/keys/foo_dir?dir=true',
          pool: { maxSockets: 9999 }
        });
        
        done();
      });
    });
    
  }); // #rmdir
  

  /*
  describe('#setPath', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.setPath).to.be.a('function');
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