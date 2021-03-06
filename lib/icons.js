function sq(size) {
  return {width: size, height: size}
}

module.exports = [
  {prefix: 'android-chrome', size: sq(192)},
  {prefix: 'android-chrome', size: sq(256)},
  {prefix: 'android-chrome', size: sq(384)},
  {prefix: 'android-chrome', size: sq(512)},
  {prefix: 'apple-touch-icon', size: sq(180), rel: 'apple-touch-icon'},
  {prefix: 'favicon', size: sq(32), rel: 'icon'},
  {prefix: 'favicon', size: sq(64), rel: 'icon'},
  {prefix: 'favicon', size: sq(192), rel: 'icon'},
  {prefix: 'favicon', sizes: [sq(16), sq(32), sq(64)], extension: 'ico', rel: 'shortcut icon'},
]
