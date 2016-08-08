/* eslint-env mocha */
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import MaskedInput from 'src'

const setup = () => {
  const element = document.createElement('div')
  document.body.appendChild(element)
  return element
}

const cleanup = (element) => {
  ReactDOM.unmountComponentAtNode(element)
  document.body.removeChild(element)
}

describe('MaskedInput', () => {
  it('should render (smokescreen test)', () => {
    expect.spyOn(console, 'error')
    expect(<MaskedInput />).toExist()
    expect(console.error.calls[0].arguments[0]).toMatch(
      new RegExp(
        'Warning: Failed prop type: Required prop ' +
        '`mask` was not specified in `MaskedInput`.'
      )
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

  it('should handle updating mask', () => {
    const el = setup()
    let ref = null
    let defaultMask = '1111 1111 1111 1111'
    let amexMask = '1111 111111 11111'

    function render(props) {
      ReactDOM.render(
        <MaskedInput
          ref={(r) => {
            if (r) ref = r
          }}
          {...props}
        />,
        el
      )
    }

    render({mask: defaultMask})
    let input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('____ ____ ____ ____')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(0)

    render({mask: amexMask})
    input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('____ ______ _____')
    expect(input.size).toBe(17)
    expect(input.selectionStart).toBe(0)

    cleanup(el)
  })

  it('should handle updating value', () => {
    const el = setup()
    let ref = null
    let defaultMask = '1111 1111 1111 1111'

    function render(props) {
      ReactDOM.render(
        <MaskedInput
          ref={(r) => ref = r}
          {...props}
        />,
        el
      )
    }

    render({mask: defaultMask, value: ''})
    let input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('____ ____ ____ ____')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(0)

    // update value
    render({mask: defaultMask, value: '4111111111111111'})
    input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('4111 1111 1111 1111')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(19)

    cleanup(el)
  })

  it('should handle updating mask and value', () => {
    const el = setup()
    let ref = null
    let defaultMask = '1111 1111 1111 1111'
    let amexMask = '1111 111111 11111'
    let value = ''
    let mask = defaultMask

    function render(props) {
      ReactDOM.render(
        <MaskedInput
          ref={(r) => ref = r}
          {...props}
        />,
        el
      )
    }

    render({mask, value})
    let input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('____ ____ ____ ____')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(0)

    // update mask and value
    render({mask: amexMask, value: '378282246310005'})
    input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('3782 822463 10005')
    expect(input.size).toBe(17)
    expect(input.selectionStart).toBe(17)

    cleanup(el)
  })

  it('should remove leftover placeholder characters when switching to smaller mask', () => {
    const el = setup()
    let ref = null
    let defaultMask = '1111 1111 1111 1111'
    let amexMask = '1111 111111 11111'
    let mask = defaultMask
    let value = null

    function render(props) {
      ReactDOM.render(
        <MaskedInput
          ref={(r) => {
            if (r) ref = r
          }}
          mask={mask}
          value={value}
        />,
        el
      )
    }

    render()
    let input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('____ ____ ____ ____')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(0)

    mask = amexMask
    value = '1234 123456 12345'
    render()
    input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('1234 123456 12345')
    expect(input.size).toBe(17)

    cleanup(el)
  })

  it('should handle updating multiple values', () => {
    const el = setup()
    let ref = null
    let defaultMask = '1111 1111 1111 1111'
    const mastercard = '5555555555554444'
    const visa = '4111111111111111'

    function render(props) {
      ReactDOM.render(
        <MaskedInput
          ref={(r) => ref = r}
          {...props}
        />,
        el
      )
    }

    render({mask: defaultMask, value: ''})
    let input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('')
    expect(input.placeholder).toBe('____ ____ ____ ____')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(0)

    // update mask and value
    render({mask: defaultMask, value: visa})
    input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('4111 1111 1111 1111')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(19)

    // update mask and value
    render({mask: defaultMask, value: mastercard})
    input = ReactDOM.findDOMNode(ref)

    // initial state
    expect(input.value).toBe('5555 5555 5555 4444')
    expect(input.size).toBe(19)
    expect(input.selectionStart).toBe(19)

    cleanup(el)
  })
})
