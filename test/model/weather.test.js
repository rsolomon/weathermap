$(function() {
    module("Weather: API", {
        setup: function() {
            this.weather = new solomon.model.Weather;
        },
        teardown: function() {
            delete this.weather;
        }
    });

    test("parse with symbol", function() {
        var data = {
            "from": "2012-04-08T03:00:00Z",
            "to": "2012-04-08T06:00:00Z",
            "datatype": "forecast",
            "location": {
                "latitude": "40.1465",
                "altitude": "1839",
                "symbol": {
                    "number": "1",
                    "id": "SUN"
                },
                "precipitation": {
                    "unit": "mm",
                    "value": "0.0"
                },
                "longitude": "-112.4103"
             }
        };
        var parsedData = this.weather.parse(data);
        ok(parsedData.symbol instanceof solomon.model.Symbol, "Symbol parsed to symbol object");
        ok(parsedData.from instanceof Date, "from converted to date object");
        deepEqual(parsedData.from.getTime(), new Date("2012-04-08T03:00:00Z").getTime(), "from has proper time");
        ok(parsedData.to instanceof Date, "to converted to date object");
        deepEqual(parsedData.to.getTime(), new Date("2012-04-08T06:00:00Z").getTime(), "to has proper time");
        deepEqual(parsedData.latitude, "40.1465", "Arbitrary location property properly transferred.");
        deepEqual(parsedData.longitude, "-112.4103", "Arbitrary location property properly transferred.");
        equal(parsedData.datatype, undefined, "datatype not transferred after parse");
    });

    test("parse with extended weather info", function() {
        var data = {
            "from": "2012-04-08T06:00:00Z",
            "to": "2012-04-08T09:00:00Z",
            "datatype": "forecast",
            "location": {
                "highClouds": {
                    "id": "HIGH",
                    "percent": "0.0"
                },
                "latitude": "40.1465",
                "windDirection": {
                    "name": "E",
                    "id": "dd",
                    "deg": "93.7"
                },
                "humidity": {
                    "unit": "percent",
                "value": "17.5"
                },
                "altitude": "1839",
                "cloudiness": {
                    "id": "NN",
                    "percent": "0.0"
                },
                "pressure": {
                    "unit": "hPa",
                    "id": "pr",
                    "value": "1021.9"
                },
                "lowClouds": {
                    "id": "LOW",
                    "percent": "0.0"
                },
                "longitude": "-112.4103",
                "fog": {
                    "id": "FOG",
                    "percent": "0.0"
                },
                "mediumClouds": {
                    "id": "MEDIUM",
                    "percent": "0.0"
                },
                "temperature": {
                    "unit": "celcius",
                    "id": "TTT",
                    "value": "4.2"
                },
                "windSpeed": {
                    "name": "Flau vind",
                    "beaufort": "1",
                    "id": "ff",
                    "mps": "0.9"
                }
            }
        };
        var parsedData = this.weather.parse(data);
        ok(parsedData.from instanceof Date, "from converted to date object");
        deepEqual(parsedData.from.getTime(), new Date("2012-04-08T06:00:00Z").getTime(), "from has proper time");
        ok(parsedData.to instanceof Date, "to converted to date object");
        deepEqual(parsedData.to.getTime(), new Date("2012-04-08T09:00:00Z").getTime(), "to has proper time");
        deepEqual(parsedData.pressure.unit, "hPa", "Arbitrary location property properly transferred.");
        deepEqual(parsedData.windSpeed.name, "Flau vind", "Arbitrary location property properly transferred.");
        deepEqual(parsedData.temperature.unit, "celcius", "Arbitrary location property properly transferred.");
        equal(parsedData.datatype, undefined, "datatype not transferred after parse");
    });
});