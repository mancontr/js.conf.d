const assert = require('assert')
const path = require('path')
const jsconfd = require('../src/index.js')

describe('File listing', () => {
  it('Lists all files from a single folder', () => {
    const files = jsconfd.getEnabledFiles(['./test/samples/t1'])
    assert.equal(files.length, 2)
    assert.equal(files[0], path.resolve(__dirname, 'samples/t1/c1.js'))
    assert.equal(files[1], path.resolve(__dirname, 'samples/t1/c2.js'))
  })

  it('Lists the highest-priority files from multiple folders', () => {
    const files = jsconfd.getEnabledFiles(['./test/samples/t1', './test/samples/t2'])
    assert.equal(files.length, 3)
    assert.equal(files[0], path.resolve(__dirname, 'samples/t2/c1.js'))
    assert.equal(files[1], path.resolve(__dirname, 'samples/t1/c2.js'))
    assert.equal(files[2], path.resolve(__dirname, 'samples/t2/c3.js'))
  })

  it('Works with absolute paths', () => {
    const files = jsconfd.getEnabledFiles([path.resolve(__dirname, 'samples/t1')])
    assert.equal(files.length, 2)
  })

  it('Does not break on missing folders', () => {
    const files = jsconfd.getEnabledFiles(['./test/samples/tmissing', './test/samples/t1'])
    // We only need to check that no exception was thrown
    assert.equal(files.length, 2)
  })
})


describe('File loading', () => {
  it('Merges files correctly', () => {
    const cfg = jsconfd(['./test/samples/t1', './test/samples/t2'])
    assert.equal(cfg.k1, 't2/c1/k1')
    assert.equal(cfg.k2, 't1/c2/k2')
    assert.equal(cfg.k3, 't1/c2/k3')
    assert.equal(cfg.k4, 't2/c3/k4')
    assert.equal(Object.keys(cfg).length, 4)
  })

  it('Does not load overriden files at all', () => {
    const cfg = jsconfd(['./test/samples/terr', './test/samples/t1'])
    // We only need to check that no exception was thrown
    assert.equal(Object.keys(cfg).length, 3)
  })
})


describe('Parameters', () => {
  it('Uses the custom merge function', () => {
    const arrayMerger = (current, add) => {
      for (const key of Object.keys(add)) {
        current[key] = current[key] || []
        current[key].push(add[key])
      }
      return current
    }
    const cfg = jsconfd(['./test/samples/t1', './test/samples/t2'], {
      merge: arrayMerger
    })
    assert.deepEqual(cfg.k1, ['t2/c1/k1'])
    assert.deepEqual(cfg.k2, ['t2/c1/k2', 't1/c2/k2'])
    assert.deepEqual(cfg.k3, ['t1/c2/k3'])
    assert.deepEqual(cfg.k4, ['t2/c3/k4'])
    assert.equal(Object.keys(cfg).length, 4)
  })

  it('Uses the custom filename sort function', () => {
    const sort = (a, b) => a < b ? 1 : -1
    const cfg = jsconfd(['./test/samples/t1', './test/samples/t2'], { sort })
    assert.equal(cfg.k1, 't2/c1/k1')
    assert.equal(cfg.k2, 't2/c1/k2')
    assert.equal(cfg.k3, 't1/c2/k3')
    assert.equal(cfg.k4, 't2/c3/k4')
    assert.equal(Object.keys(cfg).length, 4)
  })
})
