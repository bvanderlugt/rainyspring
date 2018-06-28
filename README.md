# RAINYSPRING

The original objective with this project was to play with [Ruuvi tag](https://ruuvi.com/) on web bluetooth and send data to a web service. The web service would store data in a timeseries database (influxdb) and surface an endpoint where users could get the latest weather data from the Ruuvi tag.

After a some research and testing I learned that Ruuvi tag is not quite ready for web bluetooth so I choose to forward the existing eddystoneUrl to my web service where it is parsed and stored and served. 

## Setup

### start the beacon scanner from RasPi or laptop
TODO figure out how to access host bluetooth from docker (priveledge mode probably?)

```
cd forwarder
npm start
```
https://github.com/futomi/node-beacon-scanner

### boot the app+db

```
docker-compose up
```

### ruuvi default eddystoneUrl protocol
https://github.com/ruuvi/ruuvi-sensor-protocols

### To launch docker-compose service on Azure


pulls from buld @ https://hub.docker.com/r/blairvee/rainyspring/builds/
If I take this project down this deployment will not work
```
resourceGroup="rainyspring"
location="westus2"

// only have to run this once
az group create -l $location -n $resourceGroup

az group deployment create \
--name TestDeployment \
--resource-group $resourceGroup \
--template-file rainyspring.json \
--parameters 'adminUsername=ubuntu' \
'adminPassword=password' \
'dnsNameForPublicIP=rainyspring'

```