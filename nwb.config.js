module.exports = {
  type: 'react-component',
  build: {
    externals: {
      'react': 'React'
    },
    global: 'MaskedInput',
    jsNext: true,
    umd: true
  }
}
