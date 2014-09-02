var Client = require('../../../lib/client')
  , clientPath = '../../lib/client';
describe('lib/client', function () {
  it('should export a function', function () {
    expect(Client).to.be.a('function');
  });

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
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party?dir=true');
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
      }
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
        expect(url).to.be.equal('http://localhost:4001/v2/keys/welcome/to/the/party');
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
  });

  describe('#getValue', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.getValue).to.be.a('function');
    });
  });

  describe('#deleteValue', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.deleteValue).to.be.a('function');
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

});