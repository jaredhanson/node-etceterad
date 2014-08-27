var Client = require('./lib');
var client = new Client();
console.log('Setting');
client.setValue('wow/man', 'hey', function(err) {
  if (err) { console.log(err); }
  console.log('Getting');
  client.getValue('wow/man', function(err, result) {
    if (err) { console.log(err); }
    console.log(result);
    console.log('Deleting');
    client.deleteValue('wow/man', 'value', function (err) {
      if (err) { console.log(err); }
      console.log('we did it!');
    });
  });
})