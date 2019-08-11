/**
@license
Copyright (c) 2019 elifents. All rights reserved.
*/

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class";
import { PaperDialogBehavior } from "@polymer/paper-dialog-behavior/paper-dialog-behavior";
import "@polymer/paper-dialog-behavior/paper-dialog-shared-styles";
import "@polymer/iron-flex-layout/iron-flex-layout";
import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import "@polymer/paper-button/paper-button";
import "@polymer/iron-icon/iron-icon";
import "@polymer/iron-icons/hardware-icons";
import "@polymer/paper-styles/color";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-ripple/paper-ripple";
import "@polymer/neon-animation/neon-animated-pages";
import "@polymer/neon-animation/neon-animatable";
import "@polymer/neon-animation/animations/fade-in-animation.js";
import "@polymer/neon-animation/animations/fade-out-animation.js";
import "web-animations-js/web-animations-next-lite.min.js";
import "@polymer/iron-list/iron-list";

/**
    paper-datepicker is a polymer element which used material design theme. paper-datepicker gives a modal dialog.
    Hence it can used with any other elemts like paper-button or paper-input and then read and write values using custom 
    element properties.

    paper-datepicker uses moment.js for all the computations.

    To demonstrate lets use a paper-input.
    <paper-input label="Date" value="{{demoDate}}">
      <paper-icon-button
        slot="suffix"
        icon="date-range"
        on-click="openDateBox"
      >
      </paper-icon-button>
    </paper-input>
    <paper-datepicker with-backdrop opened="{{opened}}" date="{{demoDate}}"></paper-datepicker>

    Realize that 
    * opened in paper-datepicker controlls whether the element is currently visible or not
    * value of paper-input is binded with the date of paper-datepicker
    * on-click event from paper-icon-button will be calling function openDateBox, with will then set opened to true
    * As opened is set to true, it opens up paper-datepicker.
    * Once a date is being selected it is then passed to property date and then to demoDate.
    
    Properties
    ** opened
      type: boolen,
      default: false
      Controls whether paper-datepicker is opened or not
    
    ** date
      type: String,
      default: today
      Current date value of paper-datepicker

    ** format
      type: String
      default: YYYY-MM-DD
      The format of date-value in paper-datepicker. It supports all formats supplied by moment.js

* @customElement
* @group elifent
* @polymer
* @element paper-datepicker
* @demo /demo/index.html

*/

import moment from "moment";
/**
 * `paper-datepicker`
 * Polymer 3 date picker element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class PaperDatepicker extends mixinBehaviors(
  PaperDialogBehavior,
  PolymerElement
) {
  static get template() {
    return html`
      <style is="custom-style" include="iron-flex iron-flex-alignment"></style>
      <style>
        :host {
          dispay: block;
          min-width: 300px;
          background: #fff;
          user-select: none;
        }
        /*Class for <div> which prints year and selected date*/
        .calendarHeader {
          padding: 25px;
          color: #ffffff;
          background-color: var(--paper-indigo-900);
          @apply --layout-vertical;
        }
        /*Class for <div> which prints year*/
        .year {
          font-size: 18px;
          color: var(--paper-indigo-300);
        }
        /*Class for <div> which prints month name*/
        .header {
          font-size: 30px;
        }
        /*Class for <div> that hold naviagation icons*/
        .nav {
          height: 50px;
          @apply --layout-horizontal;
          @apply --layout-center;
          padding: 10px;
        }
        /*For the span that prints Month and Year*/
        .monthYear {
          @apply --layout-flex;
          text-align: center;
        }
        /*Class for table that prints day*/
        table {
          border-collapse: collapse;
          border: solid thin #fff;
          margin: 10px;
        }
        td {
          text-align: center;
          cursor: pointer;
          height: 40px;
          width: 40px;
          margin: 8px;
        }
        .calendar tr:first-child {
          border-bottom: solid thin var(--paper-blue-grey-500);
        }
        .calendar tr:first-child > td {
          color: var(--paper-blue-grey-500);
        }
        td > .dateItem {
          margin: auto;
          height: 30px;
          width: 30px;
          border-radius: 15px;
          @apply --layout-vertical;
          @apply --layout-center-center;
        }
        /*Class for today in calendar*/
        .today {
          border: solid thin var(--paper-indigo-900);
          background-color: #fff;
          color: var(--paper-indigo-900);
        }
        /*Class for selected date in calendar*/
        .highlight {
          background-color: var(--paper-indigo-900);
          color: #fff;
        }
        iron-icon {
          cursor: pointer;
          --iron-icon-stroke-color: var(--dark-secondary-opacity);
        }
        paper-button {
          color: var(--paper-indigo-900);
          margin-top: 10px;
        }
        paper-item {
          color: var(--secondary-text-color);
          @apply --layout-center-center;
        }
        paper-item.onScreenYear {
          color: var(--paper-indigo-900);
          font-weight: bold;
          font-size: 18px;
        }
        neon-animatable {
          position: relative;
        }
        /*Class for dialog dismiss button container*/
        .footer {
          padding: 10px;
          margin-bottom: 10px;
        }
      </style>
      <div class="layout vertical" on-iron-overlay-closed="dismissDialog">
        <div class="calendarHeader">
          <div class="year" on-click="_changeView" id="year">{{_year}}</div>
          <div class="header">{{_header}}</div>
        </div>
        <div class="nav">
          <iron-icon
            icon="hardware:keyboard-arrow-left"
            on-click="_navigate"
            id="prevMonth"
          ></iron-icon>
          <span class="monthYear" on-click="_changeView" id="month"
            >{{_monthYear}}</span
          >
          <iron-icon
            icon="hardware:keyboard-arrow-right"
            on-click="_navigate"
            id="nextMonth"
          ></iron-icon>
        </div>
        <neon-animated-pages
          id="pages"
          selected="{{_view}}"
          attr-for-selected="name"
        >
          <neon-animatable name="calendar">
            <table class="calendar">
              <tr>
                <td>S</td>
                <td>M</td>
                <td>T</td>
                <td>W</td>
                <td>T</td>
                <td>F</td>
                <td>S</td>
              </tr>
              <template is="dom-repeat" items="[[_monthArray]]" as="week">
                <tr>
                  <template is="dom-repeat" items="[[week]]">
                    <td>
                      <div
                        style="position:relative"
                        on-click="_setDate"
                        id="[[item.day]]"
                        class$="dateItem {{_getBackground(item.active)}} {{_checkToday(item.day)}}"
                      >
                        [[item.day]]
                        <paper-ripple></paper-ripple>
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </table>
          </neon-animatable>
          <neon-animatable name="month">
            <table>
              <tr>
                <td>
                  <paper-button id="jan" on-click="_setMonth">Jan</paper-button>
                </td>
                <td>
                  <paper-button id="feb" on-click="_setMonth">Feb</paper-button>
                </td>
                <td>
                  <paper-button id="mar" on-click="_setMonth">Mar</paper-button>
                </td>
              </tr>
              <tr>
                <td>
                  <paper-button id="apr" on-click="_setMonth">Apr</paper-button>
                </td>
                <td>
                  <paper-button id="may" on-click="_setMonth">May</paper-button>
                </td>
                <td>
                  <paper-button id="jun" on-click="_setMonth">Jun</paper-button>
                </td>
              </tr>
              <tr>
                <td>
                  <paper-button id="jul" on-click="_setMonth">Jul</paper-button>
                </td>
                <td>
                  <paper-button id="aug" on-click="_setMonth">Aug</paper-button>
                </td>
                <td>
                  <paper-button id="sep" on-click="_setMonth">Sep</paper-button>
                </td>
              </tr>
              <tr>
                <td>
                  <paper-button id="oct" on-click="_setMonth">Oct</paper-button>
                </td>
                <td>
                  <paper-button id="nov" on-click="_setMonth">Nov</paper-button>
                </td>
                <td>
                  <paper-button id="dec" on-click="_setMonth">Dec</paper-button>
                </td>
              </tr>
            </table>
          </neon-animatable>
          <neon-animatable name="year">
            <div style="height:250px;overflow-y:scroll" id="yearListContainer">
              <iron-list
                items="{{_years}}"
                index-as="index"
                scroll-target="yearListContainer"
                scroll-offset="-90"
                id="yearList"
              >
                <template>
                  <paper-item
                    class$="{{_checkYear(item.year)}}"
                    on-click="_setYear"
                    id="{{item.year}}"
                  >
                    [[item.year]]
                  </paper-item>
                </template>
              </iron-list>
            </div>
          </neon-animatable>
        </neon-animated-pages>

        <div class="buttons footer">
          <paper-button dialog-dismiss>Cancel</paper-button>
          <paper-button dialog-confirm on-click="_passDate">Ok</paper-button>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      /** Current date value of date picker. */
      date: {
        type: String,
        value: null,
        observer: "_update",
        notify: true
      },
      /** Default date that need to set selected when date picker is iniized. Value is expected in string format.
       * Passed value should also match the format that is being supplied. If format and default values foramt
       * doesn't matched then date picker throws invalid date.
       */
      default: {
        type: String,
        value: "today"
      },
      /** Foramt of date value. Supports all the moment date format.*/
      format: {
        type: String,
        value: "YYYY/MM/DD"
      },
      /**
        Dates that is currently shown in the date picker.
        Basically this will be NaviagatedYear/NaviagatedMonth/CurrentDate
        When navigates in the callender, we set this variable according and then plot dates in callender
       */
      _screenDate: {
        type: String,
        value: null
      },
      /**
       * All dates in the month based on their weekday name
       */
      _monthArray: {
        type: Array,
        value: null,
        notify: true
      },
      /**
       * Used to store year number
       */
      _year: {
        type: String,
        value: null
      },
      /**
       * Used to store value printed at the header. This will be selected date in ddd, MMM DD format
       */
      _header: {
        type: String,
        value: null
      },
      /**
       * Month and year value printed at the navigation element.
       */
      _monthYear: {
        type: String,
        value: null
      },
      /**
       * Date that has been currently clicked by user. But this will not be confirmed to
       * this.date until user clicks on OK. When user navigates to next month or year, this value will get reset.
       */
      _selectedDate: {
        type: String,
        value: null
      },
      /**
       * Current view of the element, it can be calendar, month, year
       */
      _view: {
        type: String,
        value: "calendar"
      },
      /**
       * Used to store years which is listed in the year view, currently storing years from 1900 to 2100.
       */
      _years: {
        type: Array,
        value: [],
        notify: true
      }
    };
  }

  ready() {
    super.ready();
    this._header = new moment().format("ddd, MMM DD");
    for (let i = 1900, j = 0; i < 2100; i++, j++) {
      this.push("_years", {
        index: j,
        selected: false, // true if the current item is selected
        tabIndex: j, // a dynamically generated tabIndex for focus management
        year: i
      });
    }
  }

  //Update is called by observer in date.
  _update() {
    //If passed date is null or nothing then date will be set as default date
    if (this.date == null || this.date == "") {
      if (this.default == "today") {
        this.date = moment().format(this.format);
      } else {
        this.date = this.default;
      }
    }
    //Sets screenDate and then calls plot()
    this._screenDate = this.date;
    this._selectedDate = this.date;
    this._plot();
  }

  //Draws date boxed in the date picker
  _plot() {
    //set day based on the screenDate.
    //set day as first of month and lastDay as last day of month. We then push each days to a
    //weekArray first and then to monthArray.
    const day = moment(this._screenDate, this.format).startOf("month");
    const lastDay = moment(this._screenDate, this.format).endOf("month");
    //set year and month based on day
    this._year = day.format("YYYY");
    this._monthYear = day.format("MMMM YYYY");
    //set monthArray to null.
    let monthArray = [];
    //creates a new weekArray. Each item will be an object which has a day value and a flag 'active',
    //active will be true if selectedDate is equal to the day.
    let weekArray = ["", "", "", "", "", "", ""].map(function() {
      return {
        day: "",
        active: false
      };
    });
    do {
      //replace items in the weekArray based with new values
      weekArray[day.day()] = {
        day: day.format("D"),
        active: this._isSelectedDate(day)
      };

      //Adds a date and then check whether its the last day of a week, if it is then
      //push earlier weekArray to monthArray and create a new weekArray.
      day.add(1, "d");
      if (day.day() == 0 && day.isSameOrBefore(lastDay)) {
        monthArray.push(weekArray);
        weekArray = ["", "", "", "", "", "", ""].map(function() {
          return {
            day: "",
            active: false
          };
        });
      }
    } while (day.isSameOrBefore(lastDay));
    //At the end push last weekArray created.
    monthArray.push(weekArray);
    //Mutate value to monthArray
    this._monthArray = monthArray;
  }

  //replots dates based on the navigation button clicked
  _navigate(e) {
    //When navigates selectedDate will be set to null.
    //adds/subtracts days from screenDate value based on the navigation button clicked.
    const day = moment(this._screenDate, this.format).startOf("month");
    switch (e.target.id) {
      case "prevYear":
        day.subtract(1, "y");
        break;
      case "nextYear":
        day.add(1, "y");
        break;
      case "prevMonth":
        day.subtract(1, "M");
        break;
      case "nextMonth":
        day.add(1, "M");
        break;
    }
    //Sets new date as screenDate and then calls plot()
    this._screenDate = day.format(this.format);
    this._plot();
  }

  //Sets date when user clicks on a date, this is captured based on the id of clicked item.
  _setDate(e) {
    //sets day as the first of day of screenDate.
    let day = moment(this._screenDate, this.format).startOf("month");

    let id = e.target.id;

    //If id is blank then user has clicked on blank box, return;
    if (id == "") return;

    //Sets selected date based on the clicked id.
    this._selectedDate = day.set("date", id).format(this.format);

    //And now set the header of date picker
    this._header = day.set("date", id).format("ddd, MMM DD");

    //Get date and iterate through each values in monthArray to set active flag
    let currentday = day.set("date", id).format("D");
    for (let i = 0; i < this._monthArray.length; i++) {
      for (let j = 0; j < this._monthArray[i].length; j++) {
        if (this._monthArray[i][j].day == currentday) {
          this.set("_monthArray." + i + "." + j + ".active", true);
        } else {
          this.set("_monthArray." + i + "." + j + ".active", false);
        }
      }
    }
  }

  //Set month and then replot calendar
  _setMonth(e) {
    const day = moment(this._screenDate, this.format).month(e.target.id);
    this._screenDate = day.format(this.format);
    this._plot();
    this._view = "calendar";
  }

  //Set month and then replot calendar
  _setYear(e) {
    const day = moment(this._screenDate, this.format).year(e.target.id);
    this._screenDate = day.format(this.format);
    this._plot();
    this._view = "calendar";
  }

  //Returns true if passed day is equal to selectedDate
  _isSelectedDate(day) {
    if (day.isSame(moment(this._selectedDate, "YYYY/MM/DD"))) {
      return true;
    } else {
      return false;
    }
  }

  //Dynamic class computation
  _getBackground(flag) {
    if (flag) {
      return "highlight";
    } else {
      return "";
    }
  }

  _checkToday(date) {
    //Today
    const today = new moment().format("YYYY-MM-DD");
    const inCommingDate = new moment(this._screenDate, this.format)
      .date(date)
      .format("YYYY-MM-DD");
    if (today == inCommingDate) {
      return "today";
    } else {
      return "";
    }
  }

  _checkYear(year) {
    //On screen year
    const onScreenYear = new moment(this._screenDate, this.format).format(
      "YYYY"
    );
    if (year == onScreenYear) {
      return "onScreenYear";
    } else {
      return "";
    }
  }

  //Pass date to parent via date property
  _passDate() {
    if (this._selectedDate != null) this.date = this._selectedDate;
  }

  //Managing views
  _changeView(e) {
    this._view = e.target.id;
    if (this._view == "year") {
      const onScreenYear = new moment(this._screenDate, this.format).format(
        "YYYY"
      );
      this.$.yearList.scrollToIndex(onScreenYear - 1900);
    }
  }
}

window.customElements.define("paper-datepicker", PaperDatepicker);
