ko.bindingHandlers.rangepicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor(), allBindings = allBindingsAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        // Now manipulate the DOM element
        $(element).rangepicker({
            onRangeUpdated: function (newRange) {
                value(newRange);
            }
        });
    }
};
