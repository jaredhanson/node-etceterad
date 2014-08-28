var Client = require('./lib');
var client = new Client();
console.log('Setting');
client.setValue('hey/man/wam', 'hey', function(err) {
  if (err) { console.log(err); }
  console.log('Getting');
  client.getValue('hey/man/wam', function(err, result) {
    if (err) { console.log(err); }
    client.updateTTL('k', '9', 9, function (err, res) {
      if (err) {
        console.error(err);
      }
      console.log('Deleting');
      client.deletePath('hey', function (err) {
        if (err) { console.log(err.message); }
        console.log('we did it!');
      });
    })
  });
});