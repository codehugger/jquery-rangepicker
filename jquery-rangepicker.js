(function($) {

    /* the number of days in the month */
    Date.prototype.daysInMonth = function () {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    };

    /* beginning of day at 00:00:00.000 */
    Date.prototype.startOfDay = function () {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0, 0);
    };

    /* end of day at 23:59:59.999 */
    Date.prototype.endOfDay = function () {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 23, 59, 59, 999);
    };

    /* start of week at 00:00:00.000 */
    Date.prototype.startOfWeek = function () {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() - this.getDay()).startOfDay();
    };

    /* end of week at 23:59:59.999 */
    Date.prototype.endOfWeek = function () {
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (6 - this.getDay())).endOfDay();
    };

    /* start of month at 00:00:00.000 */
    Date.prototype.startOfMonth = function () {
        return new Date(this.getFullYear(), this.getMonth(), 1).startOfDay();
    };

    /* end of month at 23:59:59.999 */
    Date.prototype.endOfMonth = function () {
        return new Date(this.getFullYear(), this.getMonth(), this.daysInMonth()).endOfDay();
    };

    /* first day of first week of the month at 00:00:00.000 */
    Date.prototype.startOfCalendar = function() {
        return (new Date(this.getFullYear(), this.getMonth(), 1)).startOfWeek();
    };

    /* last day of last week of the month at 23:59:59.999 */
    Date.prototype.endOfCalendar = function () {
        return (new Date(this.getFullYear(), this.getMonth(), this.daysInMonth())).endOfWeek();
    };

    /* first weekday of the month */
    Date.prototype.firstDayOfMonth = function () {
        this.startOfMonth().getDay();
    };

    /* last weekday of the month */
    Date.prototype.lastDayOfMonth = function () {
        this.endOfMonth().getDay();
    };

    /* ISO date */
    Date.prototype.toISODateString = function () {
        return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate();
    };

    /* Month and year display */
    Date.prototype.toMonthYearString = function () {
        return this.getFullYear() + '-' + (this.getMonth() + 1);
    };

    $.fn.rangepicker = function (opts) {
        // make reference to root object
        var self = this;

        // constants
        var TODAY = new Date().startOfDay().valueOf();
        var DAYS_IN_WEEK = 7;
        var WEEKS_IN_MONTH = 6;
        var PERIOD_TYPES = ['day', 'week', 'month', 'custom'];

        // declare internals
        var currentDate, dateFrom, dateTo, periodType, displayedDate, selectingLast;

        /*
         * event handler for clicking a day in the calendar
         */
        function dateSelected(e) {
            // fetch the selected date from the id of the element
            selectedDate = new Date($(this).attr('id'));

            // cycle day, week and month
            if (currentDate.valueOf() === selectedDate.valueOf() && periodType == 'day' ) { periodType = 'week'; }
            else if (currentDate.valueOf() === selectedDate.valueOf() && periodType == 'week') { periodType = 'month'; }
            else if (currentDate.valueOf() === selectedDate.valueOf() && periodType == 'month') { periodType = 'day'; }

            // assign the clickedDate to currentDate
            currentDate = selectedDate;

            // update the dateFrom and dateTo
            updateRange();

            // display the component
            render();

            // stop event from propagating
            e.preventDefault();
        }

        /*
         * event handler for clicking the 'back' button on the calendar
         */
        function prevMonth(e) {
            var currentMonth = displayedDate.getMonth() - 1;
            if (currentMonth < 0) {
                displayedDate.setFullYear(displayedDate.getFullYear() - 1);
                currentMonth = 11;
            }
            displayedDate.setMonth(currentMonth);
            render();
            e.preventDefault();
        }

        /*
         * event handler for clicking the 'forward' button on the calendar
         */
        function nextMonth(e) {
            var currentMonth = displayedDate.getMonth() + 1;
            if (currentMonth > 11) {
                displayedDate.setFullYear(displayedDate.getFullYear() + 1);
                currentMonth = 0;
            }
            displayedDate.setMonth(currentMonth);
            render();
            e.preventDefault();
        }

        /*
         * handles the construction of a jquery node for a day setting all the
         * correct display classes for selected, today and included
         */
        function buildDay(date) {
            var day_node = $('<span class="day"></span>');

            // identify this day by date of month
            day_node.attr('id', date.toISODateString());
            day_node.html(date.getDate());

            // set class for today
            if (date.valueOf() === TODAY) {
                day_node.addClass('today');
            }

            // set class for dates in range
            if (date.valueOf() >= dateFrom.valueOf() &&
                date.valueOf() <= dateTo.valueOf()) {
                day_node.addClass('included');
            }

            // set class of selected date
            if (periodType === 'custom') {
                // if we are dealing with a custom range both the start
                // of the period and the end are considered selected
                if (date.valueOf() === dateFrom.startOfDay().valueOf() ||
                    date.valueOf() === dateTo.startOfDay().valueOf()) {
                    day_node.addClass('selected');
                }
            }
            else {
                // if we are dealing with a fixed range the clicked date
                // is considered selected
                if (date.valueOf() === currentDate.valueOf()) {
                    day_node.addClass('selected');
                }
            }

            // set class for days that are part of the displayed month
            if (date.getMonth() !== displayedDate.getMonth()) {
                day_node.addClass('disabled');
            }
            else {
                day_node.addClass('enabled');
            }

            // register click event on date
            day_node = day_node.on('click', dateSelected);

            return day_node;
        }

        /*
         * handles the construction of the jquery node for a week for given date
         */
        function buildWeek(date) {
            var week_node = $('<div class="week"></tr>');
            for (var i=0; i < DAYS_IN_WEEK; i++) {
                week_node.append(buildDay(new Date(date)));
                date.setDate(date.getDate() + 1);
            }
            return week_node;
        }

        /*
         * handles the construction of the jquery node for the month given
         */
        function buildMonth(date) {
            var month_node = $('<span class="month"></span>');
            for (var i=0; i < WEEKS_IN_MONTH; i++) {
                month_node.append(buildWeek(new Date(date)));
                date.setDate(date.getDate() + DAYS_IN_WEEK);
            }
            return month_node;
        }

        /*
         * handles the construction of the jquery node for the calendar area
         */
        function buildCalendar(date) {
            var calendar_node = $('<div class="calendar"></div>');
            calendar_node.append(buildMonth(new Date(date)));
            return calendar_node;
        }

        /*
         * handles the construction of the jquery node for the navigation controls
         */
        function buildNav(date) {
            // initialize elements
            var nav_node = $('<div class="navigation"></div>');
            var prev_node = $('<span class="prev">&lt;</span>').on('click', prevMonth);
            var label_node = $('<span class="display"></span>').html(displayedDate.toMonthYearString());
            var next_node = $('<span class="next">&gt;</span>').on('click', nextMonth);

            // construct navigation area
            nav_node.append(prev_node);
            nav_node.append(label_node);
            nav_node.append(next_node);

            return nav_node;
        }

        /*
         * properly handles setting dateFrom and dateTo depending on mode and selection
         */
        function updateRange() {

            if (periodType === 'custom') {
                // we require two clicks in order to determine from and to
                // and until then we get the second click we need a stable
                // range which is beginning of currentDate to end of currentDate
                if (selectingLast) {
                    dateTo = currentDate.endOfDay();
                }
                else {
                    dateFrom = currentDate.startOfDay();
                    dateTo = currentDate.endOfDay();
                }
                selectingLast = !selectingLast;
            }
            else {
                from = new Date(currentDate.valueOf());
                to = new Date(currentDate.valueOf());

                // when not in custom mode we cycle between period types
                // and determine the boundaries around currentDate
                if (periodType === 'day') {
                    from = from.startOfDay();
                    to = to.endOfDay();
                }
                else if (periodType === 'week') {
                    from = from.startOfWeek();
                    to = to.endOfWeek();
                }
                else if (periodType === 'month') {
                    from = from.startOfMonth();
                    to = to.endOfMonth();
                }

                dateFrom = new Date(from);
                dateTo = new Date(to);
            }

            if (dateFrom.valueOf() > dateTo.valueOf()) {
                // after we have determined from and two there is
                // the possibility of dateFrom being after dateTo
                // if this happens we simply swap them
                var tmp = new Date(dateTo.valueOf());
                dateTo = new Date(dateFrom.valueOf());
                dateFrom = tmp;
            }
        }

        /*
         * constructs and displays the rangepicker
         */
        function render() {
            var root = $('<div class="rangepicker"></div>');
            root.append(buildNav(displayedDate.startOfCalendar()));
            root.append(buildCalendar(displayedDate.startOfCalendar()));
            self.html(root);
        }

        /*
         * validates options and initializes the rangepicker
         */
        function init(opts) {

            // set internals according to options and defaults
            currentDate = opts.currentDate || new Date().startOfDay();
            dateFrom = opts.dateFrom || currentDate.startOfDay();
            dateTo = opts.dateTo || currentDate.endOfDay();
            periodType = opts.periodType || PERIOD_TYPES[0];
            displayedDate = opts.displayedDate || currentDate.startOfMonth();
            selectingLast = false;

            // initial build
            render();

            // return reference to self for jquery chaining
            return self;
        }

        // intialize and return
        return init(opts);
    };
}(jQuery));
