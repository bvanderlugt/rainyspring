const BeaconScanner = require('node-beacon-scanner');
const fetch = require('node-fetch');
const scanner = new BeaconScanner();

// "http://localhost:8080/incoming"
var redirectUrl = process.argv[2] || "http://localhost:8080/incoming"
console.log('forwarding to: ', redirectUrl)


// Set an Event handler for beacons
scanner.onadvertisement = (ad) => {
  console.log('forwarding: \n', JSON.stringify(ad));
  fetch(redirectUrl, {
      method: 'POST',
      body: JSON.stringify(ad),
      mode: 'cors',
      headers: customHeaders
    })
  .then(res => {
    if (!res.ok) {
      return Error('Tried to forwarded url but response from server not ok: ', res.statusText)
    }
    console.log('success')
  })
  .catch(err => {
    console.log('unable to forward url', err)
  })
};

var customHeaders = {
    'Content-Type': 'application/json'
};

// Start scanning
scanner.startScan().then(() => {
  console.log('Started to scan.')  ;
}).catch((error) => {
  console.error(error);
});
