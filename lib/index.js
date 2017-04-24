const fs = require('fs')
const sharp = require('sharp')
const toIco = require('to-ico')
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

function generateBuffer(imageBuffer, icon) {
  if (icon.extension === 'ico') {
    const pngs = icon.sizes.map(size => {
      const pngIcon = Object.assign({size}, icon, {extension: 'png'})
      return generateBuffer(imageBuffer, pngIcon)
    })
    return Promise.all(pngs).then(buffers => toIco(buffers))
  } else {
    return sharp(imageBuffer)
      .resize(icon.size.width, icon.size.height)
      .max()
      .toFormat('png')
      .toBuffer()
  }
}

function getFilename(icon) {
  const size = (icon.sizeAsString && `-${icon.sizeAsString}`) || ''
  const extension = icon.extension || 'png'
  return `${icon.prefix}${size}.${extension}`
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
      const sizeAsString = icon.size && `${icon.size.width}x${icon.size.height}`
      icon = Object.assign({sizeAsString}, icon)

      return generateBuffer(imageBuffer, icon)
        .then(buffer => {
          return Object.assign({
            image: buffer,
            filename: getFilename(icon),
          }, icon)
        })
    })

    return Promise.all(promises)
  })
}

module.exports = generateFavicons
