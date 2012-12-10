$(function() {
    module("Location: API", {
        setup: function() {
            this.location = new solomon.model.Location;
        },
        teardown: function() {
            delete this.location;
        }
    });

    test("initialize", function() {
        ok(this.location._geocoder instanceof google.maps.Geocoder, "Geocoder initialized.");
        var weatherCollection = this.location.get("weatherCollection");
        ok(weatherCollection instanceof solomon.collection.WeatherCollection,
            "Weather collection initialized");
        var weatherCollectionResetCalled = false;
        this.location.on("weatherChange", function() {
            weatherCollectionResetCalled = true;
        });
        weatherCollection.add([{
            id: "test"
        }]);
        weatherCollection.reset();
        ok(weatherCollectionResetCalled, "WeatherCollection reset triggered event.");
    });

    test("fetch", 2, function() {
        this.location.on("locationChange", function() {
            ok(1, "Fire location change event on valid results.");
        });
        this.location.set({
            latitude: "9.0",
            longitude: "-9.0"
        });
        this.location.on("locationError", function() {
            ok(1, "Fire location error event on invalid results.");
        });
        this.location.set({
            latitude: "0.0",
            longitude: "0.0"
        });
    });

    test("parse", function() {
        var data = [{
                formatted_address: "address0"
            },
            {
                formatted_address: "address1"
            }];
        var parsedData = this.location.parse(data);
        deepEqual(parsedData.address, "address1", "Gets data[1] if available.");
        delete data[1];
        parsedData = this.location.parse(data);
        deepEqual(parsedData.address, "address0", "Gets data[0] only if data[1] doesn't exist.");
    });
});