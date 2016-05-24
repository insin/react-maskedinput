/* eslint-env mocha */
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import MaskedInput from 'src'

const setup = () => {
  const element = document.createElement('div')
  document.body.appendChild(element)
  return element;
};

const cleanup = (element) => {
  ReactDOM.unmountComponentAtNode(element)
  document.body.removeChild(element)
}

describe('MaskedInput', () => {
  it('should render (smokescreen test)', () => {
    expect.spyOn(console, 'error')
    expect(<MaskedInput />).toExist()
    expect(console.error.calls[0].arguments[0]).toBe(
      'Warning: Failed propType: Required prop `mask` was not specified in ' +
      '`MaskedInput`.'
    )
  })

  it('should handle a masking workflow', () => {
    const el = setup()
    let ref = null
    ReactDOM.render(
      <MaskedInput
        ref={(r) => {
          if (r) ref = r
        }}
        mask="11/11"
      />,
      el
    )
    const input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('__/__')
    expect(input.size).toBe(5)

    cleanup(el)
  })

  it('should handle updating mask masking', () => {
    const el = setup()
    let ref = null
    let defaultMask = '1111 1111 1111 1111'
    let amexMask = '1111 111111 11111'
    let mask = defaultMask

    function render() {
      ReactDOM.render(
        <MaskedInput
          ref={(r) => {
            if (r) ref = r
          }}
          mask={mask}
        />,
        el
      )
    }

    render();
    let input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('____ ____ ____ ____')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(0)

    mask = amexMask
    render();
    input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('____ ______ _____')
    expect(input.size).toBe(17)
    expect(input.selectionStart).toBe(0)

    cleanup(el)
  })
})

