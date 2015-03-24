# `MaskedInput`

A [React](http://facebook.github.io/react/) component for `<input>` masking,
built on top of [inputmask-core](https://github.com/insin/inputmask-core).

## [Live Demo](http://insin.github.io/react-maskedinput/)

## Usage

Give `MaskedInput` a [`pattern`](#pattern-string) and an `onChange` callback:

```javascript
var React = require('react')
var MaskedInput = require('react-maskedinput')

var CreditCardDetails = React.createClass({
  state: {
    card: '',
    expiry: '',
    ccv: ''
  },

  _onChange(e) {
    var stateChange = {}
    stateChange[e.target.name] = e.target.value
    this.setState(stateChange)
  },

  render() {
    return <div className="CreditCardDetails">
      <label>
        Card Number:{' '}
        <MaskedInput pattern="#### #### #### ####" name="card" size="20" onChange={this._onChange}/>
      </label>
      <label>
        Expiry Date:{' '}
        <MaskedInput pattern="##/####" name="expiry" onChange={this._onChange}/>
      </label>
      <label>
        CCV:{' '}
        <MaskedInput pattern="###" name="ccv" onChange={this._onChange}/>
      </label>
      <pre><code>{JSON.stringify(this.state, null, 2)}</code></pre>
    </div>
  }
})
```

## Props

### `pattern` : `string`

The masking pattern to be applied to the `<input>`.

See the [inputmask-core docs](https://github.com/insin/inputmask-core#pattern)
for supported formatting characters.

### `onChange` : `(event: SyntheticEvent) => any`

A callback which will be called any time the mask's value changes.

This will be passed a `SyntheticEvent` with the input accessible via
`event.target` as usual.

**Note:** this component currently calls `onChange` directly, it does not
generate an `onChange` event which will bubble up like a regular `<input>`
comonent, so you *must* pass an `onChange` if you want to get a value back out.

### `value` : `string`

A default value for the mask.

### `size` : `number | string`

By default, the rendered `<input>`'s `size` will be the length of the pattern,
but you can pass a `size` prop to override this.

### Other props

Any other props passed in will be passed as props to the rendered `<input>`,
except for the following, which are managed by the component:

* `maxLength` - will always be equal to the pattern's `.length`
* `onKeyDown`, `onKeyPress` & `onPaste` - will each trigger a call to `onChange`
when necessary

## MIT LICENSED