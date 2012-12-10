// Mock google object so we don't depend on being connected to their API. Stub out necessary methods.
window.google = {
    maps: {
        Map: function(el, attrs) { },
        MapTypeId: {
            TERRAIN: 1
        },
        event: {
            addListener: function(a, b) {
                a.listenerAdded = true
            }
        },
        Geocoder: function(){
            this.geocode = function(data, success) {
                var results = [{
                        formatted_address: "Fake0"
                    },
                    {
                        formatted_address: "Fake1"
                    }];
                success(results, google.maps.GeocoderStatus[data.latLng.lat === "0.0" ? "BAD" : "OK"]);
            }
        },
        GeocoderStatus: {
            OK: 1,
            BAD: 2
        },
        LatLng: function(lat, lng) {
            this.lat = lat;
            this.lng = lng;
        },
        Marker: function(coords) {
            this.setMap = function(map) { }
        }
    }
};

// Mock responseText object for collection fetch calls
solomon.test = (solomon.test || {});
solomon.test.weatherResponseText = {
    "weatherdata": {
        "product": {
            "time": [{
                "from": "2012-04-08T03:00:00Z",
                "to": "2012-04-08T06:00:00Z",
                "location": {
                    "latitude": "40.1465",
                    "longitude": "-112.4103",
                    "temperature" : {
                        value: "15.0",
                        unit: "celcius"
                    },
                    "pressure": {
                        "value": "1024",
                        "unit": "mmHg"
                    },
                    "windDirection": {
                        "value" : "256",
                        "name" : "N"
                    },
                    "windSpeed": {
                        "mps": "25"
                    },
                    "humidity": {
                        "value": "50"
                    }
                 }
            },
            {
                "from": "2012-04-08T03:00:00Z",
                "to": "2012-04-08T06:00:00Z",
                "location": {
                    "latitude": "40.1465",
                    "longitude": "-112.4103",
                    "symbol" : {
                        id: "SUN",
                        number: "1"
                    },
                    "precipitation": {
                        "value": "1.0",
                        "unit": "mm"
                    }
                 }
            }]

        }
    }
};