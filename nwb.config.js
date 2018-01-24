module.exports = function(build) {
  var config = {
    type: 'react-component',
    npm: {
      umd: {
        externals: {
          'react': 'React'
        },
        global: 'MaskedInput'
      }
    }
  }

  if (/^build/.test(build.command)) {
    // Don't include default polyfills in the demo build
    config.polyfill = false
  }

  return config
}
