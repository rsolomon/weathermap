// Represents location data. Given a latitude and longitude, this
// model will reverse geocode the coordinates to provide relevent
// location data.
solomon.model.Location = Backbone.Model.extend({
    _geocoder: undefined,

    defaults: {
        latitude: 0.0,
        longitude: 0.0,
        weatherCollection: undefined
    },

    initialize: function() {
        this._geocoder = new google.maps.Geocoder();
        var weatherCollection = new solomon.collection.WeatherCollection();
        weatherCollection.bind("reset", this._onWeatherCollectionReset, this);
        this.set({
            weatherCollection: weatherCollection
        });
        this.on("change", this.fetch, this);    // `fetch` updated location data from Google when properties are changed
    },

    fetch: function() {
        // We can't use a typical `Backbone.fetch` here since we're doing an API call instead of a GET request
        var latLng = new google.maps.LatLng(this.get("latitude"), this.get("longitude"));
        this._geocoder.geocode({
            'latLng': latLng
        }, _.bind(this._onFetchSuccess, this));
    },

    parse: function(data) {
        // Let's only get granular if limited information is returned.
        var validData = data[1] || data[0];
        if (validData) {
            return {
                address: validData.formatted_address
            }
        }
    },

    _onWeatherCollectionReset: function() {
        this.trigger("weatherChange", this.get("weatherCollection"));
    },

    _onFetchSuccess: function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var parsedResponse  = this.parse(results);
            if (parsedResponse) {
                // Only try to update the weather data if some sort of geocoded information is returned from Google
                this.get("weatherCollection").fetch({
                    latitude: this.get("latitude"),
                    longitude: this.get("longitude")
                });
                this.set(parsedResponse, { silent: true });
                this.trigger("locationChange");
            }
        } else {
            this.trigger("locationError", status);
        }
    }
});