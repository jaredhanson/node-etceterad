var Client = require('../../../lib/client')
  , clientPath = '../../../lib/client';
describe('lib/client', function () {
  it('should export a function', function () {
    expect(Client).to.be.a('function');
  });

  describe('#setPath', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.setPath).to.be.a('function');
    });
  });

  describe('#getPath', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.getPath).to.be.a('function');
    });
  });

  describe('#deletePath', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.deletePath).to.be.a('function');
    });
  });

  describe('#setValue', function () {
    var clientInstance = new Client();
    it('should be a function', function () {
      expect(clientInstance.setValue).to.be.a('function');
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