// Represents various weather forecast attributes for a certain
// location inside of a time interval.
// ===================================
solomon.model.Weather = Backbone.Model.extend({
    parse: function(attrs) {
        var symbol,
            location = attrs.location;
        if (location.symbol) {
            symbol = new solomon.model.Symbol();
            symbol.set(symbol.parse(location.symbol));
            location.symbol = symbol;
        }
        return $.extend({
            from: new Date(attrs.from),
            to: new Date(attrs.to)
        }, location);
    },

    getToAsString: function() {
        return this._formatDate(this.get("to"));
    },

    getFromAsString: function() {
        return this._formatDate(this.get("from"));
    },

    _formatDate: function(date) {
        var hours = date.getHours(),
            suffix = "am";
        if (hours > 12) {
            hours -= 12;
            suffix = hours === 12 ? "am" : "pm";
        } else if (hours === 0) {
            hours = 12;
        }
        return date.toDateString() + " " + hours + ":00" + suffix;
    }
});