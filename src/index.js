import React from 'react'
import PropTypes from 'prop-types'
import InputMask from 'inputmask-core'

var KEYCODE_Z = 90
var KEYCODE_Y = 89

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
}

function getSelection (el) {
  var start, end, rangeEl, clone

  if (el.selectionStart !== undefined) {
    start = el.selectionStart
    end = el.selectionEnd
  }
  else {
    try {
      el.focus()
      rangeEl = el.createTextRange()
      clone = rangeEl.duplicate()

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
  var rangeEl

  try {
    if (el.selectionStart !== undefined) {
      el.focus()
      el.setSelectionRange(selection.start, selection.end)
    }
    else {
      el.focus()
      rangeEl = el.createTextRange()
      rangeEl.collapse(true)
      rangeEl.moveStart('character', selection.start)
      rangeEl.moveEnd('character', selection.end - selection.start)
      rangeEl.select()
    }
  }
  catch (e) { /* not focused or not visible */ }
}

class MaskedInput extends React.Component {
  constructor(props) {
    super(props)

    this._onChange = this._onChange.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._onPaste = this._onPaste.bind(this)
    this._onKeyPress = this._onKeyPress.bind(this)
  }

  componentWillMount() {
    var options = {
      pattern: this.props.mask,
      value: this.props.value,
      formatCharacters: this.props.formatCharacters
    }
    if (this.props.placeholderChar) {
      options.placeholderChar = this.props.placeholderChar
    }
    this.mask = new InputMask(options)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mask !== nextProps.mask && this.props.value !== nextProps.mask) {
      // if we get a new value and a new mask at the same time
      // check if the mask.value is still the initial value
      // - if so use the nextProps value
      // - otherwise the `this.mask` has a value for us (most likely from paste action)
      if (this.mask.getValue() === this.mask.emptyValue) {
        this.mask.setPattern(nextProps.mask, {value: nextProps.value})
      }
      else {
        this.mask.setPattern(nextProps.mask, {value: this.mask.getRawValue()})
      }
    }
    else if (this.props.mask !== nextProps.mask) {
      this.mask.setPattern(nextProps.mask, {value: this.mask.getRawValue()})
    }
    else if (this.props.value !== nextProps.value) {
      this.mask.setValue(nextProps.value)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.mask !== this.props.mask) {
      this._updatePattern(nextProps)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mask !== this.props.mask && this.mask.selection.start) {
      this._updateInputSelection()
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

  _onChange(e) {
    // console.log('onChange', JSON.stringify(getSelection(this.input)), e.target.value)

    var maskValue = this.mask.getValue()
    if (e.target.value !== maskValue) {
      // Cut or delete operations will have shortened the value
      if (e.target.value.length < maskValue.length) {
        var sizeDiff = maskValue.length - e.target.value.length
        this._updateMaskSelection()
        this.mask.selection.end = this.mask.selection.start + sizeDiff
        this.mask.backspace()
      }
      var value = this._getDisplayValue()
      e.target.value = value
      if (value) {
        this._updateInputSelection()
      }
    }
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  _onKeyDown(e) {
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
        var value = this._getDisplayValue()
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

  _onKeyPress(e) {
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

  _onPaste(e) {
    // console.log('onPaste', JSON.stringify(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)

    e.preventDefault()
    this._updateMaskSelection()
    // getData value needed for IE also works in FF & Chrome
    if (this.mask.paste(e.clipboardData.getData('Text'))) {
      e.target.value = this.mask.getValue()
      // Timeout needed for IE
      setTimeout(this._updateInputSelection, 0)
      if (this.props.onChange) {
        this.props.onChange(e)
      }
    }
  }

  _getDisplayValue() {
    var value = this.mask.getValue()
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
    var ref = r => { this.input = r }
    var maxLength = this.mask.pattern.length
    var value = this._getDisplayValue()
    var eventHandlers = this._getEventHandlers()
    var { size = maxLength, placeholder = this.mask.emptyValue } = this.props

    var { placeholderChar, formatCharacters, ...cleanedProps } = this.props // eslint-disable-line
    var inputProps = { ...cleanedProps, ...eventHandlers, ref, maxLength, value, size, placeholder }
    return <input {...inputProps} />
  }
}

MaskedInput.propTypes = {
  mask: PropTypes.string.isRequired,

  formatCharacters: PropTypes.object,
  placeholderChar: PropTypes.string
}

MaskedInput.defaultProps = {
  value: ''
}

export default MaskedInput
