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
        var self = this;
        var currentDate = new Date().startOfDay();
        var dateFrom = new Date().startOfDay();
        var dateTo = new Date().endOfDay();
        var periodType = 'day';
        var displayedDate = new Date().startOfMonth();
        var today = new Date().startOfDay();
        var now = new Date();
        var selectingLast = false;

        var DAYS_IN_WEEK = 7;

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

        function updateRange() {

            if (periodType === 'custom') {
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
                var tmp = new Date(dateTo.valueOf());
                dateTo = new Date(dateFrom.valueOf());
                dateFrom = tmp;
            }

            console.log('periodType', periodType);
            console.log('dateFrom', dateFrom);
            console.log('dateTo', dateTo);
        }

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

        function buildDay(date) {
            var day_node = $('<span class="day"></span>');

            // identify this day by date of month
            day_node.attr('id', date.toISODateString());
            day_node.html(date.getDate());

            // set class for today
            if (date.valueOf() === today.valueOf()) {
                day_node.addClass('today');
            }

            // set class for dates in range
            if (date.valueOf() >= dateFrom.valueOf() &&
                date.valueOf() <= dateTo.valueOf()) {
                day_node.addClass('inrange');
            }

            // set class of selected date
            if (periodType === 'custom') {
                if (date.valueOf() === dateFrom.startOfDay().valueOf() ||
                    date.valueOf() === dateTo.startOfDay().valueOf()) {
                    day_node.addClass('selected');
                }
            }
            else {
                if (date.valueOf() === currentDate.valueOf()) {
                    day_node.addClass('selected');
                }
            }

            // set class for displayed month
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

        function buildWeek(date) {
            var week_node = $('<div class="week"></tr>');
            for (var i=0; i < 7; i++) {
                week_node.append(buildDay(new Date(date)));
                date.setDate(date.getDate() + 1);
            }
            return week_node;
        }

        function buildMonth(date) {
            var month_node = $('<span class="month"></span>');
            for (var i=0; i < 6; i++) {
                month_node.append(buildWeek(new Date(date)));
                date.setDate(date.getDate() + DAYS_IN_WEEK);
            }
            return month_node;
        }

        function buildCalendar(date) {
            var calendar_node = $('<div class="calendar"></div>');
            calendar_node.append(buildMonth(new Date(date)));
            return calendar_node;
        }

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

        function render() {
            var root = $('<div class="rangepicker"></div>');
            root.append(buildNav(displayedDate.startOfCalendar()));
            root.append(buildCalendar(displayedDate.startOfCalendar()));
            self.html(root);
        }

        // initial build
        render();

        return this;
    };
}(jQuery));
