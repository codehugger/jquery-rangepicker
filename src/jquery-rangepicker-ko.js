/**
 * jquery-rangepicker-ko
 *
 * @copyright 2012 Bjarki Gudlaugsson (codehugger at codehuggers dot com)
 * @version 0.1.4, January 2013 (http://codehugger.github.com/jquery-rangepicker)
 * @license see supplied LICENSE
 */

ko.bindingHandlers.rangepicker = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor(), allBindings = allBindingsAccessor();

        // Next, whether or not the supplied model property is observable,
        // get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        var from = new Date();
        var to = new Date();

        var onUpdate = allBindings.onUpdate || function (newRange) { value(newRange); };
        var onInit = allBindings.onInit;

        if (valueUnwrapped.length == 2) {
            from = valueUnwrapped[0];
            to = valueUnwrapped[1];
        }

        // Now manipulate the DOM element
        $(element).rangepicker({
            onUpdate: onUpdate,
            dateFrom: from,
            dateTo: to
        });
    }
};

ko.bindingHandlers.strftime = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor(), allBindings = allBindingsAccessor();

        // Next, whether or not the supplied model property is observable,
        // get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        // Extract the date format from the settings or apply the default which is ISO
        var dateFormat = allBindings.dateFormat || "%Y-%m-%dT%H:%M:%S";

        // Now manipulate the DOM element
        if (valueUnwrapped) {
            $(element).html(valueUnwrapped.strftime(dateFormat));
        }
    }
};
