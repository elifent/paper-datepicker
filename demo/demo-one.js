import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";

import "@polymer/paper-input/paper-input";
import "@polymer/paper-icon-button";
import "@polymer/iron-icons";
import "../paper-datepicker";

/**
 * `demo-one` Description
 *
 * @customElement
 * @polymer
 * @demo
 *
 */
class DemoOne extends PolymerElement {
  static get template() {
    return html`
      <paper-input label="Date" value="{{demoDate}}">
        <paper-icon-button
          slot="suffix"
          icon="date-range"
          on-click="openDateBox"
        >
        </paper-icon-button>
      </paper-input>
      <paper-datepicker with-backdrop opened="{{opened}}" date="{{demoDate}}"></paper-datepicker>
    `;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Use for one-time configuration of your component after local
   * DOM is initialized.
   */
  ready() {
    super.ready();
  }

  openDateBox() {
    this.opened = true;
  }
}

customElements.define("demo-one", DemoOne);
