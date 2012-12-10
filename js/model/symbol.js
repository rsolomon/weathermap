// Represents a weather symbol
// ===========================
solomon.model.Symbol = Backbone.Model.extend({
    parse: function(attrs) {
        return {
            id: attrs.id,
            url: "http://api.yr.no/weatherapi/weathericon/1.0/?symbol=" + attrs.number + ";content_type=image/png"
        };
    }
});