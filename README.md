# `MaskedInput`

A [React](http://facebook.github.io/react/) component for `<input>` masking, built on top of [inputmask-core](https://github.com/insin/inputmask-core).

![This project has never been used by its author, other than while making it.](https://img.shields.io/badge/author--usage-never-red.png "This project has never been used by its author, other than while making it")

## [Live Demo](http://insin.github.io/react-maskedinput/)

## Install

### npm

```
npm install react-maskedinput --save
```

### Browser bundle

The browser bundle exposes a global `MaskedInput` variable and expects to find a global `React` variable to work with.

* [react-maskedinput.js](https://unpkg.com/react-maskedinput/umd/react-maskedinput.js) (development version)
* [react-maskedinput.min.js](https://unpkg.com/react-maskedinput/umd/react-maskedinput.min.js) (compressed production version)

## Usage

Give `MaskedInput` a [`mask`](#mask-string) and an `onChange` callback:

```javascript
import React from 'react'
import MaskedInput from 'react-maskedinput'

class CreditCardDetails extends React.Component {
  state = {
    card: '',
    expiry: '',
    ccv: ''
  }

  _onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return <div className="CreditCardDetails">
      <label>
        Card Number:{' '}
        <MaskedInput mask="1111 1111 1111 1111" name="card" size="20" onChange={this._onChange}/>
      </label>
      <label>
        Expiry Date:{' '}
        <MaskedInput mask="11/1111" name="expiry" placeholder="mm/yyyy" onChange={this._onChange}/>
      </label>
      <label>
        CCV:{' '}
        <MaskedInput mask="111" name="ccv" onChange={this._onChange}/>
      </label>
    </div>
  }
}
```

Create some wrapper components if you have a masking configuration which will be reused:

```javascript
function CustomInput(props) {
  return <MaskedInput
    mask="1111-WW-11"
    placeholder="1234-WW-12"
    size="11"
    {...props}
    formatCharacters={{
      'W': {
        validate(char) { return /\w/.test(char ) },
        transform(char) { return char.toUpperCase() }
      }
    }}
  />
}
```

## Props

### `mask` : `string`

The masking pattern to be applied to the `<input>`.

See the [inputmask-core docs](https://github.com/insin/inputmask-core#pattern) for supported formatting characters.

### `onChange` : `(event: SyntheticEvent) => any`

A callback which will be called any time the mask's value changes.

This will be passed a `SyntheticEvent` with the input accessible via `event.target` as usual.

**Note:** this component currently calls `onChange` directly, it does not generate an `onChange` event which will bubble up like a regular `<input>` component, so you *must* pass an `onChange` if you want to get a value back out.

### `formatCharacters`: `Object`

Customised format character definitions for use in the pattern.

See the [inputmask-core docs](https://github.com/insin/inputmask-core#formatcharacters) for details of the structure of this object.

### `placeholderChar`: `string`

Customised placeholder character used to fill in editable parts of the pattern.

See the [inputmask-core docs](https://github.com/insin/inputmask-core#placeholderchar--string) for details.

### `value` : `string`

A default value for the mask.

### `placeholder` : `string`

A default `placeholder` will be generated from the mask's pattern, but you can pass a `placeholder` prop to provide your own.

### `size` : `number | string`

By default, the rendered `<input>`'s `size` will be the length of the pattern, but you can pass a `size` prop to override this.

### Other props

Any other props passed in will be passed as props to the rendered `<input>`, except for the following, which are managed by the component:

* `maxLength` - will always be equal to the pattern's `.length`
* `onKeyDown`, `onKeyPress` & `onPaste` - will each trigger a call to `onChange` when necessary

## MIT Licensed
