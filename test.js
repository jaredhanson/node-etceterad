var Client = require('./lib');
var client = new Client();
console.log('Setting');

client.setPath('/this/is/great', function (err) {
  if (err) { console.log(err); }
  client.deletePath('/this/is/great', function (err) {
    if (err) { console.log(err); }
  });
});
