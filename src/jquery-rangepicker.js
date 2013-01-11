/**
 * jquery-rangepicker
 *
 * @copyright 2012 Bjarki Gudlaugsson (codehugger at codehuggers dot com)
 * @version 0.1.2, June 2012 (http://codehugger.github.com/jquery-rangepicker)
 * @license BSD http://opensource.org/licenses/BSD-3-Clause
 */

(function ($) {

    /* the number of days in the month */
    Date.prototype.daysInMonth = function () {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    };

    /* get the number of the week */
    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(),0,1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
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

    $.fn.rangepicker = function (opts) {
        // make reference to root object
        var self = this;

        // constants
        var TODAY = new Date().startOfDay().valueOf();
        var DAYS_IN_WEEK = 7;
        var WEEKS_IN_MONTH = 6;
        var PERIOD_DAY = 0;
        var PERIOD_WEEK = 1;
        var PERIOD_MONTH = 2;
        var PERIOD_CUSTOM = 3;

        var PERIOD_CHOICES = ['day', 'week', 'month', 'custom'];

        // display formatting
        var displayFormat, valueFormat;

        // declare internals
        var currentDate, dateFrom, dateTo, periodType, displayedDate, selectingLast, onUpdate;

        // declare ui templates
        var rootTemplate, calendarTemplate, monthTemplate, weekTemplate, dayTemplate,
            navTemplate, prevTemplate, displayTemplate, nextTemplate,
            modeTemplate, fixedTemplate, customTemplate;

        // declare ui element classes
        var selectedClass, includedClass, todayClass, disabledClass, activeClass;

        /*
         * event handler for clicking a day in the calendar
         */
        self.dayClicked = function (e) {
            // fetch the selected date from the id of the element
            selectedDate = new Date($(this).attr('id'));

            // cycle day, week and month if
            if (cyclePeriodTypes) {
                if (currentDate.valueOf() === selectedDate.valueOf() && periodType == PERIOD_DAY ) {
                    periodType = PERIOD_WEEK;
                }
                else if (currentDate.valueOf() === selectedDate.valueOf() && periodType == PERIOD_WEEK) {
                    periodType = PERIOD_MONTH;
                }
                else if (currentDate.valueOf() === selectedDate.valueOf() && periodType == PERIOD_MONTH) {
                    periodType = PERIOD_DAY;
                }
            }

            // assign the clickedDate to currentDate
            currentDate = selectedDate;

            // update the dateFrom and dateTo
            self.updateRange();

            // follow display
            if ((periodType === PERIOD_CUSTOM && followCustom) ||
                (periodType !== PERIOD_CUSTOM && followFixed)) {
                displayedDate = selectedDate.startOfMonth();
            }

            // display the component
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        /*
         * event handler for selecting fixed mode
         */
        self.fixedClicked = function (e) {
            // save state from custom navigation
            currentDate = new Date(dateFrom);

            // start the period type cycle
            periodType = PERIOD_DAY;

            // move the display of the calendar to the fromDate
            displayedDate = dateFrom.startOfMonth();

            // try to realize a fixed period from the selected custom period
            self.realizePeriodType();

            // update the dateFrom and dateTo
            self.updateRange();

            // display the component
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        /*
         * event handler for selecting custom mode
         */
        self.customClicked = function (e) {
            // initialize custom mode
            periodType = PERIOD_CUSTOM;

            // make sure we have the correct selection state
            selectingLast = false;

            // display the component
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        /*
         * event handler for clicking the 'back' button on the calendar
         */
        self.prevMonth = function (e) {
            var currentMonth = displayedDate.getMonth() - 1;
            if (currentMonth < 0) {
                displayedDate.setFullYear(displayedDate.getFullYear() - 1);
                currentMonth = 11;
            }
            displayedDate.setMonth(currentMonth);

            // display the component
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        /*
         * event handler for clicking the 'forward' button on the calendar
         */
        self.nextMonth = function (e) {
            var currentMonth = displayedDate.getMonth() + 1;
            if (currentMonth > 11) {
                displayedDate.setFullYear(displayedDate.getFullYear() + 1);
                currentMonth = 0;
            }
            displayedDate.setMonth(currentMonth);

            // display the component
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        self.prevYear = function (e) {
            // decrement dislayed year
            displayedDate.setFullYear(displayedDate.getFullYear() - 1);

            // display the component
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        self.nextYear = function (e) {
            // increment displayed year
            displayedDate.setFullYear(displayedDate.getFullYear() + 1);

            // display the component
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        /*
         * event handler for clicking the 'from' button on the calendar
         */
        self.fromClicked = function (e) {
            displayedDate = new Date(dateFrom.startOfMonth());
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        /*
         * event handler for clicking the 'today' button on the calendar
         */
        self.todayClicked = function (e) {
            displayedDate = new Date(TODAY).startOfMonth();
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        /*
         * event handler for clicking the 'to' button on the calendar
         */
        self.toClicked = function (e) {
            displayedDate = new Date(dateTo.startOfMonth());
            self.render();

            // stop event from propagating
            e.preventDefault();
        };

        /*
         * handles the construction of a jquery node for a day setting all the
         * correct display classes for selected, today and included
         */
        self.buildDay = function (date) {
            var day_node = $(dayTemplate);

            // identify this day by date of month
            day_node.attr('id', date.strftime(valueFormat));
            day_node.html(date.getDate());

            // set class for today
            if (date.valueOf() === TODAY) {
                day_node.addClass(todayClass);
            }

            // set class for dates in range
            if (date.valueOf() >= dateFrom.valueOf() &&
                date.valueOf() <= dateTo.valueOf()) {
                day_node.addClass(includedClass);
            }

            // set class of selected date
            if (periodType === PERIOD_CUSTOM) {
                // if we are dealing with a custom range both the start
                // of the period and the end are considered selected
                if (date.valueOf() === dateFrom.startOfDay().valueOf() ||
                    date.valueOf() === dateTo.startOfDay().valueOf()) {
                    day_node.addClass(selectedClass);
                }
            }
            else {
                // if we are dealing with a fixed range the clicked date
                // is considered selected
                if (date.valueOf() === currentDate.valueOf()) {
                    day_node.addClass(selectedClass);
                }
            }

            // set class for days that are part of the displayed month
            if (date.getMonth() !== displayedDate.getMonth()) {
                day_node.addClass(disabledClass);
            }

            // register click event on date

            if ((minDate === null || date > minDate) &&
                (maxDate === null || date < maxDate)) {
                day_node.on('click', self.dayClicked);
            } else {
                day_node.on('click', function (e) { e.preventDefault(); });
                day_node.addClass('disabled');
            }

            return day_node;
        };

        /*
         * handles the construction of the jquery node for a week for given date
         */
        self.buildWeek = function (date) {
            var week_node = $(weekTemplate);
            for (var i=0; i < DAYS_IN_WEEK; i++) {
                // append rendered day template to week
                week_node.append(self.buildDay(new Date(date)));

                // increment date by one day
                date.setDate(date.getDate() + 1);
            }
            return week_node;
        };

        /*
         * handles the construction of the jquery node for the month given
         */
        self.buildMonth = function (date) {
            var month_node = $(monthTemplate);

            for (var i=0; i < WEEKS_IN_MONTH; i++) {
                // append rendered week template to month
                month_node.append(self.buildWeek(new Date(date)));

                // increment date by one week (in days)
                date.setDate(date.getDate() + DAYS_IN_WEEK);
            }
            return month_node;
        };

        /*
         * handles the construction of the jquery node for the calendar area
         */
        self.buildCalendar = function () {
            return $(calendarTemplate).append(self.buildMonth(new Date(displayedDate.startOfCalendar())));
        };

        /*
         * handles the construction of the jquery node for the range area
         */
        self.buildRange = function () {
            // initialize elements
            var range_node = $(rangeTemplate);
            var from_node = $(fromTemplate);
            var today_node = $(todayTemplate);
            var to_node = $(toTemplate);

            // set content
            from_node.attr('id', dateFrom.strftime(valueFormat));
            from_node.html(dateFrom.strftime(valueFormat));
            today_node.attr('id', new Date(TODAY).strftime(valueFormat));
            to_node.attr('id', dateTo.strftime(valueFormat));
            to_node.html(dateTo.strftime(valueFormat));

            // register events
            from_node.on('click', self.fromClicked);
            today_node.on('click', self.todayClicked);
            to_node.on('click', self.toClicked);

            // construct range area
            range_node.append(from_node);
            range_node.append(today_node);
            range_node.append(to_node);

            return range_node;
        };

        /*
         * handles the construction of the jquery node for the navigation controls
         */
        self.buildNav = function () {
            // initialize elements
            var nav_node = $(navTemplate);
            var prev_year_node = $(prevYearTemplate);
            var prev_month_node = $(prevMonthTemplate);
            var label_node = $(displayTemplate).html(displayedDate.strftime(displayFormat));
            var next_month_node = $(nextMonthTemplate);
            var next_year_node = $(nextYearTemplate);

            // register events for previous year
            if (minDate === null || minDate.getFullYear() < displayedDate.getFullYear()) {
                prev_year_node.on('click', self.prevYear);
            } else {
                prev_year_node.on('click', function (e) { e.preventDefault(); });
                prev_year_node.addClass('disabled');
            }

            // register events for previous month
            if (minDate === null || minDate < displayedDate) {
                prev_month_node.on('click', self.prevMonth);
            } else {
                prev_month_node.on('click', function (e) { e.preventDefault(); });
                prev_month_node.addClass('disabled');
            }

            // register events for next month
            if (maxDate === null || maxDate > displayedDate.endOfMonth()) {
                next_month_node.on('click', self.nextMonth);
            } else {
                next_month_node.on('click', function (e) { e.preventDefault(); });
                next_month_node.addClass('disabled');
            }

            // register events for next year
            if (maxDate === null || maxDate.getFullYear() > displayedDate.getFullYear()) {
                next_year_node.on('click', self.nextYear);
            } else {
                next_year_node.on('click', function (e) { e.preventDefault(); });
                next_year_node.addClass('disabled');
            }

            // construct navigation area
            nav_node.append(prev_year_node);
            nav_node.append(prev_month_node);
            nav_node.append(label_node);
            nav_node.append(next_month_node);
            nav_node.append(next_year_node);

            return nav_node;
        };

        /*
         * handles the construction of the jquery node for the mode selection controls
         */
        self.buildModeSelection = function () {
            // initialize elements
            var mode_node = $(modeTemplate);
            var fixed_node = $(fixedTemplate);
            var custom_node = $(customTemplate);

            // register events
            fixed_node.on('click', self.fixedClicked);
            custom_node.on('click', self.customClicked);

            // construct mode selection area
            mode_node.append(fixed_node);
            mode_node.append(custom_node);

            // set selection class
            if (periodType === PERIOD_CUSTOM) { custom_node.addClass(activeClass); }
            else { fixed_node.addClass(activeClass); }

            return mode_node;
        };

        /*
         * properly handles setting dateFrom and dateTo depending on mode and selection
         */
        self.updateRange = function () {
            if (periodType === PERIOD_CUSTOM) {
                // we require two clicks in order to determine from and to
                // and until then we get the second click we need a stable
                // range which is beginning of currentDate to end of currentDate
                if (selectingLast) {
                    dateTo = currentDate.endOfDay();

                    if (dateFrom > dateTo) {
                        var tmp = dateFrom.startOfDay();
                        dateFrom = dateTo.startOfDay();
                        dateTo = tmp;
                    }

                    // we only notify listener when the complete range has been determined
                    self.triggerOnUpdate();
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
                if (periodType === PERIOD_DAY) {
                    from = from.startOfDay();
                    to = to.endOfDay();
                }
                else if (periodType === PERIOD_WEEK) {
                    from = from.startOfWeek();
                    to = to.endOfWeek();
                }
                else if (periodType === PERIOD_MONTH) {
                    from = from.startOfMonth();
                    to = to.endOfMonth();
                }

                if (minDate && from < minDate) {
                    from = new Date(minDate.valueOf());
                }
                if (maxDate && to > maxDate) {
                    to = new Date(maxDate.valueOf());
                }

                dateFrom = from;
                dateTo = to;

                self.triggerOnUpdate();
            }
        };

        /*
         * triggers the onUpdate callback
         */
        self.triggerOnUpdate = function () {
            if (onUpdate) { onUpdate([dateFrom, dateTo]); }
        };

        /*
         * triggers the onInit callback
         */
        self.triggerOnInit = function () {
            if (onInit) { onInit([dateFrom, dateTo]); }
        };

        self.realizePeriodType = function () {
            var from = dateFrom.startOfDay();
            var to = dateTo.startOfDay();

            if (from.valueOf() == to.valueOf() &&
                periodType != PERIOD_CUSTOM) {
                periodType = PERIOD_DAY;
            }
            else if (from.getDay() === 0 &&
                to.getDay() === 6 &&
                from.getWeek() === to.getWeek() &&
                periodType !== PERIOD_CUSTOM) {
                periodType = PERIOD_WEEK;
            }
            else if (from.getMonth() === to.getMonth() &&
                from.getDate() === 1 &&
                (to.getDate() === from.daysInMonth() || to.getDate() === maxDate.getDate()) &&
                periodType !== PERIOD_CUSTOM) {
                periodType = PERIOD_MONTH;
            }
            else {
                selectingLast = false;
                periodType = PERIOD_CUSTOM;
            }
        };

        /*
         * constructs and displays the rangepicker
         */
        self.render = function () {
            // make sure we have a clean slate
            var root = $(rootTemplate);

            // add navigation display
            root.append(self.buildNav());

            // add range display
            root.append(self.buildRange());

            // add calendar display
            root.append(self.buildCalendar());

            // add mode selection display
            root.append(self.buildModeSelection());

            // add rangepicker to root element
            self.html(root);
        };

        /*
         * validates options and initializes the rangepicker
         */
        self.init = function(opts) {

            if (opts === undefined) { opts = {}; }

            // set internals according to options and defaults
            currentDate       = opts.currentDate      || new Date().startOfDay();
            dateFrom          = opts.dateFrom         || currentDate.startOfDay();
            dateTo            = opts.dateTo           || currentDate.endOfDay();
            periodType        = opts.periodType       || 'day';
            displayedDate     = opts.displayedDate    || currentDate.startOfMonth();
            onInit            = opts.onInit           || undefined;
            onUpdate          = opts.onUpdate         || undefined;
            cyclePeriodTypes  = opts.cycleModes       || true;
            selectingLast     = false;
            valueFormat       = opts.dateFormat       || '%Y-%m-%d';
            displayFormat     = opts.labelFormat      || '%B %Y';
            minDate           = opts.minDate          || null;
            maxDate           = opts.maxDate          || new Date();
            followFixed       = opts.followFixed      || true;
            followCustom      = opts.followCustom     || false;

            // set templates for calendar display
            rootTemplate      = opts.rootTemplate     || '<div class="rangepicker"></div>';
            dayTemplate       = opts.dayTemplate      || '<a href="#" class="day"></a>';
            weekTemplate      = opts.weekTemplate     || '<div class="week"></div>';
            monthTemplate     = opts.monthTemplate    || '<div class="month"></div>';
            calendarTemplate  = opts.calendarTemplate || '<div class="calendar"></div>';

            // set templates for navigation display
            navTemplate       = opts.navTemplate      || '<div class="navigation"></div>';
            prevYearTemplate  = opts.prevTemplate     || '<a href="#" class="prev">&laquo;</a>';
            prevMonthTemplate = opts.prevTemplate     || '<a href="#" class="prev">&lsaquo;</a>';
            displayTemplate   = opts.displayTemplate  || '<span class="display"></span>';
            nextMonthTemplate = opts.nextTemplate     || '<a href="#" class="next">&rsaquo;</a>';
            nextYearTemplate  = opts.nextTemplate     || '<a href="#" class="next">&raquo;</a>';

            // set templates for range display
            rangeTemplate     = opts.rangeTemplate    || '<div class="range"></div>';
            fromTemplate      = opts.fromTemplate     || '<a href="#" class="from"></a>';
            todayTemplate     = opts.todayTemplate    || '<a href="#" class="today">Today</a>';
            toTemplate        = opts.toTemplate       || '<a href="#" class="to"></a>';

            // set templates for mode display
            modeTemplate      = opts.modeTemplate     || '<div class="mode"></div>';
            fixedTemplate     = opts.fixedTemplate    || '<a href="#" class="fixed">Fixed</a>';
            customTemplate    = opts.customTemplate   || '<a href="#" class="custom">Custom</a>';

            // set classes for logical elements
            disabledClass     = opts.disabledClass    || 'disabled';
            selectedClass     = opts.selectedClass    || 'selected';
            includedClass     = opts.includedClass    || 'included';
            activeClass       = opts.activeClass      || 'active';
            todayClass        = opts.todayClass       || 'today';

            // allow configuration to use strings instead of cryptic numbers used internally
            $.each(function (i, value) {
                if (value === periodType) {
                    periodType = i;
                }
            });

            if (dateFrom && dateTo) {
                periodType = PERIOD_DAY;

                self.realizePeriodType();

                currentDate = dateFrom.startOfDay();
            }

            displayedDate = dateFrom.startOfMonth();

            // trigger initial update of range
            self.triggerOnInit();

            // initial build
            self.render();

            // return reference to self for jquery chaining
            return self;
        };

        // intialize and return
        return self.init(opts);
    };
}(jQuery));
