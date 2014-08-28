var Client = require('./lib');
var client = new Client();
console.log('Setting');
client.setPath('this/is/great', function(err) {
  if (err) { console.log(err); }
  console.log('Deleting');
  client.deletePath('this/is/great', function (err) {
    if (err) { console.log(err.message); }
    console.log('we did it!');
  });
});