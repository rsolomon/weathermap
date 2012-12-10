$(function() {
    module("Symbol: API", {
        setup: function() {
            this.symbol = new solomon.model.Symbol;
        },
        teardown: function() {
            delete this.symbol;
        }
    });

    test("parse", function() {
        var data = {
            id: "SUN",
            number: 1
        };
        var parsedData = this.symbol.parse(data);
        deepEqual(parsedData.id, "SUN", "Maintain id");
        deepEqual(parsedData.url,
            "http://api.yr.no/weatherapi/weathericon/1.0/?symbol=1;content_type=image/png",
            "generate url");
        equal(parsedData.number, undefined, "Does not carry over number property.");
    });
});