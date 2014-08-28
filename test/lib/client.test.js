var client = require('../../lib/client')
  , clientPath = '../../lib/client';
describe('lib/client', function () {

  it('should export a function', function () {
    expect(client).to.be.a('function');
  });

  describe('#setPath', function () {
    it('should be a function', function () {
      expect(client.setPath).to.be.a('function');
    });
  });

  describe('#getPath', function () {
    it('should be a function', function () {
      expect(client.getPath).to.be.a('function');
    });
  });

  describe('#deletePath', function () {
    it('should be a function', function () {
      expect(client.deletePath).to.be.a('function');
    });
  });

  describe('#setValue', function () {
    it('should be a function', function () {
      expect(client.setValue).to.be.a('function');
    });
  });

  describe('#getValue', function () {
    it('should be a function', function () {
      expect(client.getValue).to.be.a('function');
    });
  });

  describe('#deleteValue', function () {
    it('should be a function', function () {
      expect(client.deleteValue).to.be.a('function');
    });
  });

  describe('#setTTL', function () {
    it('should be a function', function () {
      expect(client.setTTL).to.be.a('function');
    });
  });

  describe('#updateTTL', function () {
    it('should be a function', function () {
      expect(client.updateTTL).to.be.a('function');
    });
  });

});