# \<paper-datepicker\>

Polymer 3 date picker element that uses material design specifications. Datepicker throws date value back to client, hence it can be used with any other element either it be paper-input or paper-button

# Usage

## Installation

```
npm install --save @elifent/paper-datepicker
```

## In an html file

```html
<html>
  <head>
    <script type="module">
      import '@elifent/paper-datepicker/paper-datepicker.js';
    </script>
  </head>
  <body>
    <paper-datepicker with-backdrop opened date="{{demoDate}}"></paper-datepicker>
  </body>
</html>
```

## In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import "@elifent/paper-datepicker/paper-datepicker.js";
class SampleElement extends PolymerElement {
  static get template() {
    return html`
        <paper-datepicker with-backdrop opened date="{{demoDate}}"></paper-datepicker>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```
  git clone https://github.com/elifent/paper-datepicker
  cd date-picker
  npm install
  npm install -g polymer-cli
```

### Running the demo locally

```
  polymer serve --npm
  open http://127.0.0.1:<port>/components/paper-datepicker/demo/

```

Found issues? Let me know
