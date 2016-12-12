## 3.3.2 / 2016-12-01

* Fix for both Android and MS Edge input entering

## 3.2.0 / 2016-05-24

* Allow dynamic pattern updating [[martyphee][martyphee]]

## 3.1.3 / 2016-05-02

* Don’t call `onChange` function if undefined.
* Update nwb to 0.9.x

## 3.1.2 / 2016-04-11

* Support for React 15.x.x

## 3.1.1 / 2016-03-09

* Convert tooling to use [nwb](https://github.com/insin/nwb/) [[bpugh]][[bpugh]]
* Publish `dist` files

## 3.1.0 / 2016-02-11

* Added support for `value` behaving as a controlled component.

## 3.0.0 / 2015-10-23

**Breaking change:** Now uses a `mask` prop to define the input mask instead of `pattern`, to avoid preventing use of the the HTML5 `pattern` attribute in conjunction with the input mask.

**Breaking change:** React >= 0.14 is now required.

React 0.14 compatibility. [[jquense][jquense]]

Updated to [inputmask-core@2.1.1](https://github.com/insin/inputmask-core/blob/master/CHANGES.md#211--2015-09-11)

Updates based on [inputmask-core@2.1.0](https://github.com/insin/inputmask-core/blob/master/CHANGES.md#210--2015-07-15):

* Added `placeholderChar` prop to configure the placeholder character.
* The mask's pattern is now changed if the `pattern` prop changes - the user's input so far is replayed with the new pattern (with mixed results - TBD).

UMD build is now available via npm in `dist/`. [[muffinresearch][muffinresearch]]

## 2.0.0 / 2015-04-07

**Breaking change:** [inputmask-core@2.0.0](https://github.com/insin/inputmask-core/blob/master/CHANGES.md#200--2015-04-03) is now required.

Added undo/redo when Ctrl/Command + Z/Y are used.

## 1.1.0 / 2015-03-26

Updated to [inputmask-core@1.2.0](https://github.com/insin/inputmask-core/blob/master/CHANGES.md#120--2015-03-26)

A `formatCharacters` prop can now be passed to configure input mask format characters.

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

[jquense]: https://github.com/jquense
[muffinresearch]: https://github.com/muffinresearch
[martyphee]: https://github.com/martyphee
