const assert = require('assert')
const path = require('path')
const jsconfd = require('../src/index.js')

describe('Folder loading', () => {
  it('Loads files from a single folder with correct overrides', () => {
    const cfg = jsconfd(['./test/samples/t1'])
    assert.equal(cfg.k1, 't1/c1/k1')
    assert.equal(cfg.k2, 't1/c2/k2')
    assert.equal(cfg.k3, 't1/c2/k3')
    assert.equal(Object.keys(cfg).length, 3)
  })

  it('Loads the highest priority version of files in multiple folders', () => {
    const cfg = jsconfd(['./test/samples/t1', './test/samples/t2'])
    assert.equal(cfg.k1, 't2/c1/k1')
    assert.equal(cfg.k2, 't1/c2/k2')
    assert.equal(cfg.k3, 't1/c2/k3')
    assert.equal(cfg.k4, 't2/c3/k4')
    assert.equal(Object.keys(cfg).length, 4)
  })

  it('Works with absolute paths', () => {
    const cfg = jsconfd([path.resolve(__dirname, 'samples/t1')])
    assert.equal(Object.keys(cfg).length, 3)
  })

  it('Does not load overriden files at all', () => {
    const cfg = jsconfd(['./test/samples/terr', './test/samples/t1'])
    // We only need to check that no exception was thrown
    assert.equal(Object.keys(cfg).length, 3)
  })

  it('Does not break on missing folders', () => {
    const cfg = jsconfd(['./test/samples/tmissing', './test/samples/t1'])
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
