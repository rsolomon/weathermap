// View for a Google Maps object. Handles event delegation and
// sending and receiving updates to and from the provided model.
// ============================================================
solomon.view.MapView = Backbone.View.extend({
    _map: undefined,  // Represents a google.maps.Map object
    _marker: undefined, // Represents a marker on this._map

    initialize: function() {
        this.model.on("change", this._handleLocationChange, this);

        this.initializeMap();
        this.initializeEventHandlers();
    },

    // Initializes the Google maps object to some default parameters.
    initializeMap: function() {
        this._map = new google.maps.Map(this.$el[0], {
            center: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        // Set the initial marker via a simulated location change
        this._handleLocationChange(this.model);
    },

    // Typically a `Backbone.View` object would bind events via the `events` object. Google maps are different
    // as they have their own ways of binding events to callbacks, so we initialize those here.
    initializeEventHandlers: function() {
        google.maps.event.addListener(this._map, 'click', _.bind(this._handleMapClick, this));
    },

    // Callback for a Google Maps click event.
    _handleMapClick: function(event) {
        var coords = event.latLng;
        this.model.set({
            latitude: coords.lat(),
            longitude: coords.lng()
        });
    },

    _handleLocationChange: function(location) {
        var coords = new google.maps.LatLng(location.get("latitude"), location.get("longitude"));

        // Delete the old marker, if applicable
        if (this._marker) {
            this._marker.setMap(null);
            delete this._marker;
        }
        // Add a new marker to the map representing the mouse click
        this._marker = new google.maps.Marker({
            position: coords,
            map: this._map
        });
    }
});