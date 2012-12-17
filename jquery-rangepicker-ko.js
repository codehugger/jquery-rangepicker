ko.bindingHandlers.rangepicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor(), allBindings = allBindingsAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        // Now manipulate the DOM element
        $(element).rangepicker({
            onUpdate: function (newRange) {
                value(newRange);
            }
        });
    }
};

ko.bindingHandlers.strftime = {
    update: function(element, valueAccessor, allBindingsAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor(), allBindings = allBindingsAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        // Extract the date format from the settings or apply the default which is ISO
        var dateFormat = allBindings.dateFormat || "%Y-%m-%dT%H:%M:%S";

        // Now manipulate the DOM element
        if (valueUnwrapped) {
            $(element).html(valueUnwrapped.strftime(dateFormat));
        }
    }
};
