$(function() {
    module("Weather: Collection", {
        setup: function() {
            window.callbackContext = this;
            $.mockjax({
                url: "http://xml2json.heroku.com/*",
                dataType: "jsonp",
                // This could also live in a proxy file.
                responseText: solomon.test.weatherResponseText
            });
            this.weatherCollection = new solomon.collection.WeatherCollection;
        },
        teardown: function() {
            $.mockjaxClear();
            delete this.weatherCollection;
        }
    });

    test("fetch and parse collection", function() {
        var weatherCollection = this.weatherCollection;
        weatherCollection.on("reset", function() {
            deepEqual(weatherCollection.length, 1, "Collection length after fetch.");
            var weather = weatherCollection.at(0);
            // Parse should have merged 2 objects, so both of the following should pass.
            ok(weather.get("temperature"), "Weather has temperature object.");
            ok(weather.get("symbol"), "Weather has symbol object.");
        });

        weatherCollection.fetch({
            latitude: "9.0",
            longitude: "-9.0"
        });
    });
});