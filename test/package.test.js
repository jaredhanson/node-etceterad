/* global describe, it */

var etceterad = require('..');
var Client = require('../lib/client');


describe('etceterad', function() {
  
  it('should export Client', function() {
    expect(etceterad).to.equal(Client);
  });
  
});
