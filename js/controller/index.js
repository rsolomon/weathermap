// Primary controller object for the site
// ======================================
solomon.controller.IndexController = Backbone.Router.extend({
    _introDialogSel : "#intro-dialog",
    _hideIntroCheckSel : "#never-again",
    _mapContainerSel : "#map-container",
    _infoContainerSel : "#info-container",

    constructor: function(options) {
        // `super.constructor()`
        Backbone.Router.call(this, options);

        // Cleaner way of organizing initialization code that must wait for the DOM to be ready. We can be sure this
        // function will be called after `initialize` since it's after the super `contructor` call above.
        $(_.bind(this.ready, this));
    },

    // This function is bound to document.ready in the constructor. It fires when the DOM has finished loading
    ready: function() {
        // This model ties together all of our views. It is updated by the map and has events that the `information`
        // view utilizes.
        var location = new solomon.model.Location({
            latitude: 40.736,
            longitude: -111.872
        });

        // Initialize an instance of `MapView`, which will handle all presentation layer tasks for our map.
        var mapView = new solomon.view.MapView({
            el: this._mapContainerSel,
            model: location
        });
        var informationView = new solomon.view.InformationView({
            el: this._infoContainerSel,
            model: location
        });

        // Fetch some initial data for the `location` model.
        location.fetch();

        // Show an intro dialog the first time, but allow the user to hide in for future visits.
        if(!localStorage.skipIntro) {
            $(this._introDialogSel).dialog({
                modal: true,
                show: "fade",
                hide: "fade",
                buttons: [{
                    text: "Got it!",
                    click: function() { $(this).dialog("close"); }
                }],
                close: _.bind(function() {
                    if ($(this._hideIntroCheckSel, this._introDialogSel).is(":checked")) {
                        // `localStorage` only stores strings in most browsers, so let's use a number here since they
                        // will implicitly be cast when checking for equality.
                        localStorage.skipIntro = 1;
                    }
                }, this)
            });
        }
    }
});