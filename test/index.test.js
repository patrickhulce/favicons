const fs = require('fs')
const rimraf = require('rimraf')
const expect = require('chai').expect
const generateIcons = require('../lib')

const DIST_FOLDER = `${__dirname}/fixtures/dist`

describe('index.js', () => {
  let icons
  before(() => fs.existsSync(DIST_FOLDER) || fs.mkdirSync(DIST_FOLDER))

  it('should run without error', () => {
    return generateIcons(`${__dirname}/fixtures/icon.png`).then(results => {
      icons = results
      results.forEach(result => {
        fs.writeFileSync(`${DIST_FOLDER}/${result.filename}`, result.image);
      })
    })
  })

  it('should generate basic favicons', () => {
    const filteredIcons = icons.filter(icon => icon.prefix === 'favicon')
    expect(filteredIcons).to.have.length(2)
  })

  it('should generate Chrome icons', () => {
    const filteredIcons = icons.filter(icon => icon.prefix === 'android-chrome')
    expect(filteredIcons).to.have.length(4)
  })

  it('should generate Apple touch icons', () => {
    const filteredIcons = icons.filter(icon => icon.prefix === 'apple-touch-icon')
    expect(filteredIcons).to.have.length(1)
  })
})
