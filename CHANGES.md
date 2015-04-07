## 2.0.0 / 2015-04-07

Updated to [inputmask-core@2.0.0](https://github.com/insin/inputmask-core/blob/master/CHANGES.md#200--2015-04-03)

Added undo/redo when Ctrl/Command + Z/Y are used.

## 1.1.0 / 2015-03-26

Updated to [inputmask-core@1.2.0](https://github.com/insin/inputmask-core/blob/master/CHANGES.md#120--2015-03-26)

A `formatCharacters` prop can now be passed to configure input mask format
characters.

## 1.0.0 / 2015-03-25

Initial release features:

* Based on [inputmask-core@1.1.0](https://github.com/insin/inputmask-core/blob/master/CHANGES.md#110--2015-03-25)
* Basic editing works:
  * Typing, backspacing, pasting, cutting and deleting
  * Invalid content will be ignored if typed or pasted
  * Static parts of the mask can't be modfied
  * Editing operations can handle text selections
  * Tested in latest versions of Firefox, Chrome, Opera and IE
* Placeholder generation and display when the mask has no user input
