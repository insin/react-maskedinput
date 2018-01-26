import './style.css'

import React from 'react'
import {render} from 'react-dom'

import MaskedInput from '../../src'

const PATTERNS = [
  '1111 1111',
  '111 111',
  '11 11',
  '1 1',
]

class App extends React.Component {
  state = {
    card: '',
    expiry: '',
    ccv: '',
    plate: '',
    escaped: '',
    leading: '',
    custom: '',
    changing: '',
    pattern: '1111 1111',
    cardPattern: '1111 1111 1111 1111',
  }

  _onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  _changePattern = (e) => {
    this.setState({pattern: e.target.value})
  }

  _onCardChange = (e) => {
    if (/^3[47]/.test(e.target.value)) {
      this.setState({cardPattern: '1111 111111 11111'})
    }
    else {
      this.setState({cardPattern: '1111 1111 1111 1111'})
    }
  }

  render() {
    return <div className="App">
      <h1>
        <code>&lt;<a href="https://github.com/insin/react-maskedinput">MaskedInput</a>/&gt;</code>
      </h1>
      <p className="lead">A React component which creates a masked <code>&lt;input/&gt;</code></p>
      <div className="form-field">
        <label htmlFor="card">Card Number:</label>
        <MaskedInput mask="1111 1111 1111 1111" name="card" id="card" size="20" value={this.state.card} onChange={this._onChange}/>
      </div>
      <p>You can even externally update the card state like a standard input element:</p>
      <div className="form-field">
        <label htmlFor="card">Externally Update:</label>
        <input onChange={this._onChange} name="card" maxLength="16" style={{borderBottom: '1px solid #999'}} />
      </div>
      <p>Placeholders are automatically generated but can be overridden with your own:</p>
      <div className="form-field">
        <label htmlFor="expiry">Expiry Date:</label>
        <MaskedInput mask="11/1111" name="expiry" id="expiry" placeholder="mm/yyyy" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="ccv">CCV:</label>
        <MaskedInput mask="111" name="ccv" id="ccv" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="plate">License Plate:</label>
        <MaskedInput mask="AAA 1111" name="plate" id="plate" onChange={this._onChange} placeholder="ABC 1234"/>
      </div>
      <p>Mask placeholder characters can be escaped with a leading <code>\</code> to use them as static contents:</p>
      <div className="form-field">
        <label htmlFor="escaped">Escaped:</label>
        <MaskedInput mask="11 \* 11" name="escaped" id="escaped" onChange={this._onChange}/>
      </div>
      <p>Leading static characters:</p>
      <div className="form-field">
        <label htmlFor="leading">Leading:</label>
        <MaskedInput mask="(0) 111 1111" name="leading" id="leading" onChange={this._onChange}/>
      </div>
      <p>Changing patterns:</p>
      <div className="form-field">
        <label htmlFor="changing">Input:</label>
        <MaskedInput mask={this.state.pattern} name="changing" id="changing" onChange={this._onChange}/>
      </div>
      <div className="form-field">
        <label htmlFor="pattern">Pattern:</label>
        <select onChange={this._changePattern}>
          {PATTERNS.map(pattern => <option value={pattern} key={pattern}>{pattern}</option>)}
        </select>
      </div>
      <p>Dynamically changing the pattern as the user types:</p>
      <div className="form-field">
        <label htmlFor="changing">Credit Card:</label>
        <MaskedInput mask={this.state.cardPattern} name="creditCard" id="creditCard" onChange={this._onCardChange}/>
      </div>
      <p>Custom format character (<code>W=[a-zA-Z0-9_]</code>, transformed to uppercase) and placeholder character (en space):</p>
      <div className="form-field">
        <label htmlFor="custom">Custom:</label>
        <CustomInput name="custom" id="custom" onChange={this._onChange}/>
      </div>
      <hr/>
      <pre><code>{JSON.stringify(this.state, null, 2)}</code></pre>
      <hr/>
      <footer><a href="https://github.com/insin/react-maskedinput">Source on GitHub</a></footer>
    </div>
  }
}

let CustomInput = (props) =>
  <MaskedInput
    mask="1111-WW-11"
    placeholder="1234-WW-12"
    placeholderChar=" "
    size="11"
    {...props}
    formatCharacters={{
      'W': {
        validate: (char) => /\w/.test(char),
        transform: (char) => char.toUpperCase()
      }
    }}
  />

render(<App/>, document.getElementById('demo'))
