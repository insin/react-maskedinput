import React from 'react'
import PropTypes from 'prop-types'
import InputMask from 'inputmask-core'

let KEYCODE_Z = 90
let KEYCODE_Y = 89

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
}

function getSelection (el) {
  let start, end
  if (el.selectionStart !== undefined) {
    start = el.selectionStart
    end = el.selectionEnd
  }
  else {
    try {
      el.focus()
      let rangeEl = el.createTextRange()
      let clone = rangeEl.duplicate()

      rangeEl.moveToBookmark(document.selection.createRange().getBookmark())
      clone.setEndPoint('EndToStart', rangeEl)

      start = clone.text.length
      end = start + rangeEl.text.length
    }
    catch (e) { /* not focused or not visible */ }
  }

  return { start, end }
}

function setSelection(el, selection) {
  try {
    if (el.selectionStart !== undefined) {
      el.focus()
      el.setSelectionRange(selection.start, selection.end)
    }
    else {
      el.focus()
      let rangeEl = el.createTextRange()
      rangeEl.collapse(true)
      rangeEl.moveStart('character', selection.start)
      rangeEl.moveEnd('character', selection.end - selection.start)
      rangeEl.select()
    }
  }
  catch (e) { /* not focused or not visible */ }
}

class MaskedInput extends React.Component {
  static propTypes = {
    mask: PropTypes.string.isRequired,

    formatCharacters: PropTypes.object,
    placeholderChar: PropTypes.string
  }

  static defaultProps = {
    value: ''
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mask !== this.props.mask && prevProps.value !== this.props.mask) {
      // if we get a new value and a new mask at the same time
      // check if the mask.value is still the initial value
      // - if so use the this.props value
      // - otherwise the `this.mask` has a value for us (most likely from paste action)
      if (this.mask.getValue() === this.mask.emptyValue) {
        this.mask.setPattern(this.props.mask, {value: this.props.value})
      }
      else {
        this.mask.setPattern(this.props.mask, {value: this.mask.getRawValue()})
      }
    }
    else if (this.props.mask !== this.props.mask) {
      this.mask.setPattern(this.props.mask, {value: this.mask.getRawValue()})
    }
    else if (this.props.value !== this.props.value) {
      this.mask.setValue(this.props.value)
    }

    if (this.props.mask !== prevProps.mask) {
      this.mask.selection.start && this._updateInputSelection()
      this._updatePattern(this.props)
    }
  }

  _updatePattern(props) {
    this.mask.setPattern(props.mask, {
      value: this.mask.getRawValue(),
      selection: getSelection(this.input)
    })
  }

  _updateMaskSelection() {
    this.mask.selection = getSelection(this.input)
  }

  _updateInputSelection() {
    setSelection(this.input, this.mask.selection)
  }

  _onChange = (e) => {
    // console.log('onChange', JSON.stringify(getSelection(this.input)), e.target.value)

    let maskValue = this.mask.getValue()
    let incomingValue = e.target.value
    if (incomingValue !== maskValue) { // only modify mask if form contents actually changed
      this._updateMaskSelection()
      this.mask.setValue(incomingValue) // write the whole updated value into the mask
      e.target.value = this._getDisplayValue() // update the form with pattern applied to the value
      this._updateInputSelection()
    }

    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  _onKeyDown = (e) => {
    // console.log('onKeyDown', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

    if (isUndo(e)) {
      e.preventDefault()
      if (this.mask.undo()) {
        e.target.value = this._getDisplayValue()
        this._updateInputSelection()
        if (this.props.onChange) {
          this.props.onChange(e)
        }
      }
      return
    }
    else if (isRedo(e)) {
      e.preventDefault()
      if (this.mask.redo()) {
        e.target.value = this._getDisplayValue()
        this._updateInputSelection()
        if (this.props.onChange) {
          this.props.onChange(e)
        }
      }
      return
    }

    if (e.key === 'Backspace') {
      e.preventDefault()
      this._updateMaskSelection()
      if (this.mask.backspace()) {
        let value = this._getDisplayValue()
        e.target.value = value
        if (value) {
          this._updateInputSelection()
        }
        if (this.props.onChange) {
          this.props.onChange(e)
        }
      }
    }
  }

  _onKeyPress = (e) => {
    // console.log('onKeyPress', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

    // Ignore modified key presses
    // Ignore enter key to allow form submission
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') { return }

    e.preventDefault()
    this._updateMaskSelection()
    if (this.mask.input((e.key || e.data))) {
      e.target.value = this.mask.getValue()
      this._updateInputSelection()
      if (this.props.onChange) {
        this.props.onChange(e)
      }
    }
  }

  _onPaste = (e) => {
    // console.log('onPaste', JSON.stringify(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)

    e.preventDefault()
    this._updateMaskSelection()
    // getData value needed for IE also works in FF & Chrome
    if (this.mask.paste(e.clipboardData.getData('Text'))) {
      e.target.value = this.mask.getValue()
      // Timeout needed for IE
      setTimeout(() => this._updateInputSelection(), 0)
      if (this.props.onChange) {
        this.props.onChange(e)
      }
    }
  }

  _getDisplayValue() {
    let value = this.mask.getValue()
    return value === this.mask.emptyValue ? '' : value
  }

  _keyPressPropName() {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent.match(/Android/i)
      ? 'onBeforeInput'
      : 'onKeyPress'
    }
    return 'onKeyPress'
  }

  _getEventHandlers() {
    return {
      onChange: this._onChange,
      onKeyDown: this._onKeyDown,
      onPaste: this._onPaste,
      [this._keyPressPropName()]: this._onKeyPress
    }
  }

  focus() {
    this.input.focus()
  }

  blur() {
    this.input.blur()
  }

  render() {
    let options = {
      pattern: this.props.mask,
      value: this.props.value,
      formatCharacters: this.props.formatCharacters
    }

    if (this.props.placeholderChar) {
      options.placeholderChar = this.props.placeholderChar
    }

    this.mask = new InputMask(options)
    let ref = r => { this.input = r }
    let maxLength = this.mask.pattern.length
    let value = this._getDisplayValue()
    let eventHandlers = this._getEventHandlers()
    let { size = maxLength, placeholder = this.mask.emptyValue } = this.props

    let { placeholderChar, formatCharacters, ...cleanedProps } = this.props // eslint-disable-line no-unused-vars
    let inputProps = { ...cleanedProps, ...eventHandlers, ref, maxLength, value, size, placeholder }
    return <input {...inputProps} />
  }
}

export default MaskedInput
