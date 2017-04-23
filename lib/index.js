const fs = require('fs')
const sharp = require('sharp')
const icons = require('./icons')

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

function generateFavicon(imageBuffer, icon) {
  return sharp(imageBuffer)
    .resize(icon.size.width, icon.size.height)
    .max()
    .toFormat('png')
    .toBuffer()
}

function generateFavicons(sourceImage) {
  let imageBufferPromise = Promise.resolve(sourceImage)
  if (typeof sourceImage === 'string') {
    imageBufferPromise = readFile(sourceImage)
  }

  return imageBufferPromise.then(imageBuffer => {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new TypeError('Image must be a buffer')
    }

    const promises = icons.map(icon => {
      const sizeAsString = `${icon.size.width}x${icon.size.height}`
      return generateFavicon(imageBuffer, icon)
        .then(buffer => {
          return Object.assign({
            image: buffer,
            filename: `${icon.prefix}-${sizeAsString}.png`,
            sizeAsString,
          }, icon)
        })
    })

    return Promise.all(promises)
  })
}

module.exports = generateFavicons
