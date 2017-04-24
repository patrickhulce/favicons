const fs = require('fs')
const expect = require('chai').expect
const generateIcons = require('../lib')

const DIST_FOLDER = `${__dirname}/fixtures/dist`

describe('index.js', () => {
  let icons
  before(() => fs.existsSync(DIST_FOLDER) || fs.mkdirSync(DIST_FOLDER))

  it('should run without error', () => {
    return generateIcons(`${__dirname}/fixtures/icon.png`, {
      appleIconBackground: '#188fd1',
    }).then(results => {
      icons = results
      results.forEach(result => {
        fs.writeFileSync(`${DIST_FOLDER}/${result.filename}`, result.image)
      })
    })
  })

  it('should generate basic favicons', () => {
    const filteredIcons = icons.filter(icon => icon.prefix === 'favicon')
    expect(filteredIcons).to.have.length(3)
    const pngFile = filteredIcons.find(icon => icon.filename === 'favicon-32x32.png')
    expect(pngFile).to.have.property('image').instanceOf(Buffer)
    const icoFile = filteredIcons.find(icon => icon.filename === 'favicon.ico')
    expect(icoFile).to.have.property('image').instanceOf(Buffer)
  })

  it('should generate Chrome icons', () => {
    const filteredIcons = icons.filter(icon => icon.prefix === 'android-chrome')
    expect(filteredIcons).to.have.length(4)
  })

  it('should generate Apple touch icons', () => {
    const filteredIcons = icons.filter(icon => icon.prefix === 'apple-touch-icon')
    const expectedImage = fs.readFileSync(`${__dirname}/fixtures/expected-apple-icon.png`)
    expect(filteredIcons).to.have.length(1)
    expect(filteredIcons[0]).to.have.property('image').eql(expectedImage)
  })
})
