$(function() {
    module("Map: View", {
        setup: function() {
            $("#qunit-fixture").html('<div id="map-container"></div>');
            this.mapView = new solomon.view.MapView({
                model: new solomon.model.Location,
                el: "#map-container"
            });
        },
        teardown: function() {
            delete this.mapView;
        }
    });

    test("initialize", function() {
        // Not a ton of tests here since this view deals almost exclusively with the Google Maps API.
        // Just make sure that the map was initialized properly.
        ok(this.mapView._map instanceof google.maps.Map, "Map initialized.");
        ok(this.mapView._map.listenerAdded, "Click event listener added.");
    });
});