var React = require('react')
var {getSelection, setSelection} = require('react/lib/ReactInputSelection')

var InputMask = require('inputmask-core')

var KEYCODE_Z = 90
var KEYCODE_Y = 89

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
}

var MaskedInput = React.createClass({
  propTypes: {
    mask: React.PropTypes.string.isRequired,

    formatCharacters: React.PropTypes.object,
    placeholderChar: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      value: ''
    }
  },

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
  },

  componentWillReceiveProps(nextProps) {
    // update the pattern first to avoid left over placeholders
    if (this.props.mask !== nextProps.mask) {
      this.mask.setPattern(nextProps.mask, {value: this.mask.getRawValue()})
    }
    if (this.props.value !== nextProps.value) {
      this.mask.setValue(nextProps.value)
    }
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.mask !== this.props.mask) {
      this._updatePattern(nextProps)
    }
  },

  componentDidUpdate(prevProps) {
    if (prevProps.mask !== this.props.mask && this.mask.selection.start) {
      this._updateInputSelection()
    }
  },

  _updatePattern: function(props) {
    this.mask.setPattern(props.mask, {
      value: this.mask.getRawValue(),
      selection: getSelection(this.input)
    })
  },

  _updateMaskSelection() {
    this.mask.selection = getSelection(this.input)
  },

  _updateInputSelection() {
    setSelection(this.input, this.mask.selection)
  },

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
  },

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
  },

  _onKeyPress(e) {
    // console.log('onKeyPress', JSON.stringify(getSelection(this.input)), e.key, e.target.value)

    // Ignore modified key presses
    // Ignore enter key to allow form submission
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') { return }

    e.preventDefault()
    this._updateMaskSelection()
    if (this.mask.input(e.key)) {
      e.target.value = this.mask.getValue()
      this._updateInputSelection()
      if (this.props.onChange) {
        this.props.onChange(e)
      }
    }
  },

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
  },

  _getDisplayValue() {
    var value = this.mask.getValue()
    return value === this.mask.emptyValue ? '' : value
  },

  focus() {
    this.input.focus()
  },

  blur() {
    this.input.blur()
  },

  render() {
    var {mask, formatCharacters, size, placeholder, placeholderChar, ...props} = this.props
    var patternLength = this.mask.pattern.length
    return <input {...props}
      ref={r => this.input = r }
      maxLength={patternLength}
      onChange={this._onChange}
      onKeyDown={this._onKeyDown}
      onKeyPress={this._onKeyPress}
      onPaste={this._onPaste}
      placeholder={placeholder || this.mask.emptyValue}
      size={size || patternLength}
      value={this._getDisplayValue()}
    />
  }
})

module.exports = MaskedInput
