// View for the information box, providing weather and
// location data for a given `location` model.
// ===========================================
solomon.view.InformationView = Backbone.View.extend({
    _selectors: {
        location: "#location",
        dropdownContainer: "#dropdown-container",
        weatherSelect: "#weather-select",
        weatherInfoContainer: "#weather-info-container",
        // These selectors are specific to underscore.js template markup and are used to auto-generate values for
        // `_templates`
        template: {
            dropdownOption: "#template-weather-option",
            weatherInfo: "#template-weather-info"
        }
    },

    // `_templates` is automatically populated in `initialize`. Its contents are based on `_selectors.template`
    _templates: {},

    events: {
        "change #weather-select": "_handleWeatherSelectChange"
    },

    initialize: function() {
        // Automatically cache templates based on their selectors. This could be moved to a base class if this
        // were a larger application.
        _.each(_.keys(this._selectors.template), function(key) {
            this._templates[key] = _.template($(this._selectors.template[key]).text());
        }, this);

        // Bind to the model change events.
        this.model.on("locationChange", this._renderLocation, this);
        this.model.on("locationError", this._renderEmptyLocation, this);
        this.model.on("weatherChange", this._renderWeatherSelect, this);
    },

    _renderEmptyLocation: function() {
        // Show a polite error message and hide the time dropdown info and any other weather info
        this.$(this._selectors.location).text("Sorry! No information is available for this location.");
        this.$("article:not(:first)").hide();
    },

    _renderLocation: function() {
        this.$(this._selectors.location).text(this.model.get("address"));
        this.$("article:not(:first)").show();
        // Clear the dropdown and information area, since we're expecting a new one to be generated soon
        this.$(this._selectors.weatherInfoContainer).html("");
        this.$(this._selectors.dropdownContainer).html("Loading...");
    },

    // Generates a dropdown based on a provided `WeatherCollection`, allowing
    // the user to select an option based on given timeframes.
    _renderWeatherSelect: function(weatherCollection) {
        var weatherDropdown = $("<select/>").prop("id", "weather-select");
        weatherDropdown.append("<option>-- Select a timeframe --</option>")
        weatherCollection.each(function(weather, index) {
            var weatherOption = $(this._templates.dropdownOption({
                id: index,
                from: weather.getFromAsString(),
                to: weather.getToAsString()
            }));
            weatherDropdown.append(weatherOption);
        }, this);
        this.$(this._selectors.dropdownContainer)
            .html("")
            .append(weatherDropdown);
        this.$(this._selectors.weatherInfoContainer).html("");
    },

    // Renders detailed weather information underneath the timeframe dropdown.
    _renderWeatherInformation: function(weather) {
        var $weatherInfoContainer = this.$(this._selectors.weatherInfoContainer).html(""),
            symbol = weather.get("symbol"),
            weatherJSON = $.extend({}, weather.toJSON(), symbol.toJSON());
        $weatherInfoContainer.append(this._templates.weatherInfo(weatherJSON));
    },

    _handleWeatherSelectChange: function(event) {
        var id = $(event.target).find(":selected").data("id"),
            weather = id !== undefined && this.model.get("weatherCollection").at(id);
        if (weather) {
            this._renderWeatherInformation(weather);
        } else {
            this.$(this._selectors.weatherInfoContainer).html("");
        }
    }
});