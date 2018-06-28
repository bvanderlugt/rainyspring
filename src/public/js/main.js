var app = (function() {
  'use strict';

  function validateResponse(res) {
    if (!res.ok) throw Error(res.statusText);
    return res;
  }

  function readResponseAsJSON(res) {
    return res.json();
  }

  function showLatestWeatherData(data) {
    console.log(data)
    var container = document.getElementById('target');
    var results = document.createElement('results')
    container.appendChild(results)
    results.innerHTML = renderCurrentWeather(data)
  }

  function fetchWeather() {
    fetch('/weather')
    .then(validateResponse)
    .then(readResponseAsJSON)
    .then(showLatestWeatherData)
    .catch(console.log)
  }

  function renderCurrentWeather(data) {
    var humidity = data[0].humidity
    var temp = data[0].temperature
    var pressure = data[0].air_pressure
    return ` \
    <div class=data>Temperature: ${temp}°C</div> \
    <div class=data>Humidity: ${humidity} %</div> \
    <div class=data>Air pressure: ${pressure} db</div> \
    `
  }



  return {
    fetchWeather: (fetchWeather)
  };

})();
