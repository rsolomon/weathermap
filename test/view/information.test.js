$(function() {
    module("Information: View", {
        setup: function() {
            window.callbackContext = this;
            $.mockjax({
                url: "http://xml2json.heroku.com/*",
                dataType: "jsonp",
                // This could also live in a proxy file.
                responseText: solomon.test.weatherResponseText
            });

            // This would live in 'information.test.html' if a reliable dependency management system like
            // Require.js was used.
            var html = '<section id="info-container"><article>' +
                    '<label>Current Location: </label>' +
                    '<span id="location"></span></article>' +
                    '<article><label>Show weather for: </label></article>' +
                    '<article id="dropdown-container"></article>' +
                    '<article id="weather-info-container"></article></section>';
            $("#qunit-fixture").html(html);
            this.informationView = new solomon.view.InformationView({
                model: new solomon.model.Location,
                el: "#info-container"
            });
        },
        teardown: function() {
            delete this.informationView;
        }
    });

    test("location change", function() {
        this.informationView.model.set({
            latitude: "9.0",
            longitude: "-9.0"
        });
        deepEqual($("#location").html(), "Fake1", "Location div populate on location change.");
    });

    test("weather change", function() {
        this.informationView.model.set({
            latitude: "9.0",
            longitude: "-9.0"
        });
        this.informationView.model.on("weatherChange", function() {
            // Only show call-to-action and a single combined value
            deepEqual($("#dropdown-container option").length, 2, "Render weather dropdown.");
            $("#weather-info-container").html("This should be cleared!");
            var $weatherSelect = $("#weather-select");
            $weatherSelect[0].selectedIndex = 1;
            $weatherSelect.change();
            deepEqual($("#weather-info-container").find("img").length, 1, "_renderWeatherInformation adds image.");
            // All spans should be populated with data.
            _.each($("#weather-info-container span"), function(span) {
                ok($(span).text(), "Value is not null");
            });
        });
        this.informationView.model.fetch();
    });

    test("weather error", function() {
        this.informationView.model.on("locationError", function() {
            deepEqual($("#location").text(), "Sorry! No information is available for this location.",
            "Error shows when invalid location is chosen.");
        });
        this.informationView.model.set({
            latitude: "0.0",
            longitude: "1.0"
        });
        deepEqual($("#location").text(), "Sorry! No information is available for this location.",
            "Error shows when invalid location is chosen.");
        deepEqual($("#info-container section:not(:first)").is(":visible"), false, "Weather info hides on error.");

    });
});