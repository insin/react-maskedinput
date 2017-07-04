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
    // Prevent React 15.x triggering inclusion of the Node.js process shim in the
    // demo build.
    config.webpack = {
      extra: {
        node: {
          process: false
        }
      }
    }
  }

  return config
}
