const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')
var path = require('path')
var bodyParser = require('body-parser');
var base64Decode = require('./utils/decoder').base64_decode

const dbWriter = (req, res, next) => {
  console.log('handling db write')
  if (req.path != '/incoming') {
    return next()
  }

  var finish = (req) => {
    return new Promise((resolve, reject) => {
      res.on('finish', () => {
        return resolve(req.body)
      })
    })
  }

  finish(req)
  .then(parseEddystonePayload)
  .then(convertToWeatherData)
  .then(dbWritePoints)
  .then(() => {
    console.log('weather data written to db!')
  })
  .catch(err => {
    console.log(`could not process weather data ${err.stack}`)
  })

  return next()
}

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(dbWriter)

app.get('/', function(req, res) {
  res.render('index.html')
})

app.get('/weather', function(req, res) {
  influx.query(`
    select * from weather
    order by time desc
    limit 10
  `).then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err.stack)
  })
})

app.post('/incoming', function(req, res) {
  // console.log('recieved: ', req.body);
  res.sendStatus(200);
})

const parseEddystonePayload = (body) => {
    console.log(`parseEddystonePayload of ${JSON.stringify(body)}`)
    const url = body.eddystoneUrl.url
    const data = url.split('#')[1]
    return data
}

const convertToWeatherData = (data) => {
  const decoded64 = base64Decode(data)
  const format = decoded64[0]
  if (format != 4) {
    return Error(`received format ${format} only format 4 is supported`)
  }
  return {
    format: format,
    humidity: convertToHumidity(decoded64),
    temperature: convertToTemp(decoded64),
    air_pressure: convertToPressure(decoded64),
    beacon_id: convertToBeaconId(data)
  }
}

const convertToHumidity = (decoded64) => {
  return decoded64[1] * 0.5
}

const convertToPressure = (decoded64) => {
  return ((decoded64[4] << 8) + decoded64[5]) + 50000
}

const convertToTemp = (decoded64) => {
  let uTemp = (((decoded64[2] & 127) << 8) | decoded64[3]);
  let tempSign = (decoded64[2] >> 7) & 1;
  temp = tempSign === 0 ? uTemp/256.0 : -1 * uTemp/256.0;
  return temp;
}

const convertToBeaconId = (data) => {
  console.log('decoded64 beaconId', data.charCodeAt(8))
  if (data[0] != 'B') {
    return 'unknow'
  }
  return data.charCodeAt(8);
}

const dbWritePoints = (weatherObj) => {
  console.log(`writing...${JSON.stringify(weatherObj)}`);
  influx.writePoints([
    {
      measurement: 'weather',
      tags: { beaconId: weatherObj.beacon_id },
      fields: {
        humidity: weatherObj.humidity,
        temperature: weatherObj.temperature,
        air_pressure: weatherObj.air_pressure
      },
    }
  ])
}

/* -------------
DATABASE
------------- */

const influx = new Influx.InfluxDB({
  database: 'weather_db',
  schema: [
    {
      measurement: 'weather',
      fields: {
        humidity: Influx.FieldType.FLOAT,
        temperature: Influx.FieldType.FLOAT,
        air_pressure: Influx.FieldType.FLOAT
      },
      tags: [
        'beaconId'
      ]
    }
  ]
})


// initialize db and boot app
influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('weather_db')) {
      return influx.createDatabase('weather_db')
    }
  })
  .then(() => {
    http.createServer(app).listen(8080, function() {
      console.log('Listening on port 8080')
    })
  })
  .catch(err => {
    console.log(`Error creating Influx database! ${err.stack}`)
  })
