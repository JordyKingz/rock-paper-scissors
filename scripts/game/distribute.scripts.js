const fetch = require("node-fetch");

module.exports = function(callback) {
  (async () => {
    try {
      const response =  await fetch('http://localhost:5000/rps/distribute-nft-fee')
        .then(res => res.json());
      console.log(response)
    } catch(e) {
      console.log(e)
    }
    callback();
  })();
}
