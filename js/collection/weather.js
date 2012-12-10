// Represents a collection of `weather` models.
// ============================================
solomon.collection.WeatherCollection = Backbone.Collection.extend({
    _weatherUrl: "http://api.yr.no/weatherapi/locationforecast/1.8/", // url to XML weather API
    model: solomon.model.Weather,
    // XML to JSONP proxy. Required for client-instantiated cross-domain XML ajax requests.
    url: "http://xml2json.heroku.com/?callback=jsonp",

    // Override the base `fetch` function to default to jsonp dataType, and to provide the weather URL
    // as a param to the proxy.
    fetch: function(data) {
        var options = {
            dataType: "jsonp",
            data: {
                url: this._buildWeatherUrl(data)
            }
        };
        Backbone.Collection.prototype.fetch.call(this, options);
    },

    parse: function(data) {
        var parsedData = [],
            sharedWeather;
        _.each(data.weatherdata.product.time, function(weatherInfo, index) {
            // Data returned from this particular API is interesting. The first object with a given `to` date represents
            // the precipitation and symbol for the following objects that have the same `to` value. Knowing this,
            // we can just merge them as we find them.
            if (!sharedWeather || (new Date(sharedWeather.to)).getTime() !== (new Date(weatherInfo.to)).getTime()) {
                sharedWeather = weatherInfo;
            } else {
                $.extend(weatherInfo.location, sharedWeather.location);
                parsedData.push(weatherInfo);
            }
        });
        return parsedData;
    },

    // Formats the weather URL to what the server expects.
    _buildWeatherUrl: function(attrs) {
        return this._weatherUrl + "?lat=" + attrs.latitude + ";lon=" + attrs.longitude;
    }
});