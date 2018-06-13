
var app = (function() {

  // function scan() {
  //   return navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
  //   .then(device => device.gatt.connect())
  //   .then(server => {
  //     // Getting Battery Service...
  //     return server.getPrimaryService('battery_service');
  //   })
  //   .then(service => {
  //     // Getting Battery Level Characteristic...
  //     return service.getCharacteristic('battery_level');
  //   })
  //   .then(characteristic => {
  //     // Reading Battery Level...
  //     return characteristic.readValue();
  //   })
  //   .then(value => {
  //     console.log('Battery percentage is ' + value.getUint8(0));
  //   })
  //   .catch(error => { console.log(error); });
  // }

// https://ruu.vi/\#BEQYAMbUy
  // function oneTimeRequest() {
  //   return fetch('http://localhost:8080/times',  {
  //     method: 'GET',
  //     mode: 'no-cors',
  //     headers: customHeaders
  //   })
  //   .then(validateResponse)
  //   .then(readResponseAsJSON)
  //   .then(console.log)
  //   .catch(console.log)
  // }

  // var customHeaders = new Headers({
  // 'Content-Type': 'text/plain',
  // // 'Content-Length': 'kittens' // Content-Length can't be modified!
  // 'X-Custom': 'hello world',
  // // 'Y-Custom': 'this won\'t work' // Y-Custom is not accepted by our echo server!
  // });

  function validateResponse(res) {
    if (!res.ok) return Error('res not ok');
    return res;
  }

  function readResponseAsText(res) {
    return res.text();
  }

  function readResponseAsJSON(res) {
    return res.json();
  }

  return {
    // scan: (scan),
    request: (oneTimeRequest)
  };

})();
