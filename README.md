# RAINYSPRING

Objectives: Read from Ruuvi tag over GATT/GAP BLE and write values to influxdb. Let the user know if it might be rainy.

update: Ruuvi tag is not quite ready for web bluetooth so I choose to forward the existing eddystoneUrl to my web service where it is parsed and stored in a time series db. 

[https://www.weather.gov/arx/why_dewpoint_vs_humidity](https://www.weather.gov/arx/why_dewpoint_vs_humidity)

## Setup

# beacon scanner from RasPi or laptop
https://github.com/futomi/node-beacon-scanner

# ruuvi default eddystoneUrl protocol
https://github.com/ruuvi/ruuvi-sensor-protocols
