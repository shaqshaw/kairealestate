const rp = require('request-promise');
const url = 'https://www.realtor.com/realestateandhomes-search/29115';

rp(url)
  .then(function(html){
    //success!
    console.log(html);
  })
  .catch(function(err){
    //handle error
    console.log("error");
  });