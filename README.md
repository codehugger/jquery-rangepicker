# jquery-rangepicker

A convenient date-range plugin for jquery.

## Introduction

There are a lot of datepickers out there but none of them fitted my needs. So I decided to add one more to the bunch :)
I needed something that would allow the user to define an arbitrary period and a fixed period like day, week or month
in an easy and intuitive way.

The **rangepicker** jquery plugin is simple easy and follows my two mottos in programming _Keep-It-Simple-Stupid_ and
_Principle-Of-Least-Astonishment_.

```html
<div id="rangepicker"></div>

<script type="text/javascript">
  // define a rangepicker starting on today
  $('#rangepicker').rangepicker();
</script>
```

## Live Example

There is a live demo running the latest build at [jsFiddle](http://jsfiddle.net/MPeqP/5/)

## Requirements

The jquery-rangepicker requires strftime to be implemented on the Date object. There are numerious ways to do this and you can even write your own :) However this is the one I use
and recommend:

<http://hacks.bluesmoon.info/strftime/>

## Options

**currentDate:** the currentDate for the rangepicker (default: new Date())

**dateFrom:** the start of the period defined in the calendar (default: currentDate)

**dateTo:** the end of the period defined in the calendar (default: currentDate)

**periodType:** the initial period type i.e. 'day', 'week', 'month' or 'custom' (default: 'day')

**displayedDate:** the date thate determines the month viewed in the calendar (default: currentDate)

**onUpdate:** callback for period updates (default: undefined)

**cyclePeriodTypes:** controls whether clicking on the same date should trigger a period type cycle (default: true)

**valueFormat:** the strftime format for the values displayed in from and to boxes (default: '%Y-%m-%d')

**displayFormat:** the strftime format for the date displayed in navigation area (default: '%Y %b')

**minDate:** the oldest date enabled by the calendar (default: null)

**maxDate:** the newest date enabled by the calendar (default: new Date())

**followFixed:** controls whether clicking on a date in surrounding month changes display when in fixed mode (default: false)

**followCustom:** controls whether clicking on a date in surrounding month changes display when in custom mode (default: false)

**rootTemplate:** the template that defines the base container for the rangepicker

```html
<div class="rangepicker"></div>
```

**dayTemplate:** the template that defines the node for a day in the calendar

```html
<a href="#" class="day"></a>
```

**weekTemplate:** the template that defines the node for a week in the calendar

```html
<div class="week"></div>
```

**monthTemplate:** the template that defines the node for a month in the calendar

```html
<div class="month"></div>
```

**calendarTemplate:** the template that defines the node for the calendar itself

```html
<div class="calendar"></div>
```

**navTemplate:** the template that defines the container for the navigation controls

```html
<div class="navigation"></div>
```

**prevTemplate:** the template for the previous "button"

```html
<a href="#" class="prev">&lt;</a>
```

**displayTemplate:** the template for the display area of the navigation

```html
<span class="display"></span>
```

**nextTemplate:** the template for the next "button"

```html
<a href="#" class="next">&gt;</a>
```

**rangeTemplate:** the template that defines the container for the range controls

```html
<div class="range"></div>
```

**fromTemplate:** the template for the from "button"

```html
<a href="#" class="from"></a>
```

**todayTemplate:** the template for the today "button"

```html
<a href="#" class="today">Today</a>
```

**toTemplate:** the template for the to "button"

```html
<a href="#" class="to"></a>
```

**modeTemplate:** the template that defines the container for the mode controls

```html
<div class="mode"></div>
```

**fixedTemplate:** the template for the fixed "button"

```html
<a href="#" class="fixed">Fixed</a>
```

**customTemplate:** the template for the custom "button"

```html
<a href="#" class="custom">Custom</a>
```

**disabledClass:** the class set on days outside range defined by minDate and maxDate (default: 'disabled')

**selectedClass:** the class set on day(s) selected in the calendar

**includedClass:** the class set on days included in the selected range (default: 'included')

**activeClass:** the class set on active mode area (default: 'active')

**todayClass:** the class set on day equal to today (default: 'today')

## Knockout.js bindings

A simple **rangepicker** binding for Knockout.js is included in _jquery-rangepicker-ko.js_ as well as
a binding for the included _strftime.js_ extension for javascript Date.

```html
<div data-bind="rangepicker: dateRange"></div>
<div data-bind="strftime: dateFrom, dateFormat: '%Y %b %d'"></div>
<div data-bind="strftime: dateTo, dateFormat: '%Y %b %d'"></div>

<script type="text/javascript">
  $(function () {
    var ViewModel = function () {
      this.dateRange = ko.observable([new Date(), new Date()]);
      this.dateFrom = ko.computed(function () {
        if (dateRange()) { return this.dateRange()[0]; }
      }, this)
      this.dateFrom = ko.computed(function () {
        if (this.dateRange()) { return this.dateRange()[1]; }
      }, this)
    };
    ko.applyBindings(new ViewModel());
  });
</script>
```
