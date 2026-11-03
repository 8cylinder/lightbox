import { test, describe, afterEach, mock } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register({ width: 1024, height: 768 })
await import('../src/lc-lightbox.js')

const IMG = '<img src="thumb.jpg" alt="a thumbnail">'

// Parse detached, then insert, so children exist when connectedCallback runs
function mount(html){
  const container = document.createElement('div')
  container.innerHTML = html
  const el = container.querySelector('lc-lightbox')
  document.body.appendChild(el)
  return el
}

// assert.ok with a message avoids Node pretty-printing a huge ShadowRoot on failure
function assertEnabled(el){
  assert.ok(el.shadowRoot, 'expected the lightbox to be enabled')
}
function assertDisabled(el){
  assert.ok(!el.shadowRoot, 'expected the lightbox to be disabled')
}

afterEach(()=>{
  window.happyDOM.setViewport({ width: 1024, height: 768 })
  document.body.innerHTML = ''
  document.querySelector('template#low-cal-template')?.remove()
  mock.restoreAll()
})

describe('disabled attribute', ()=>{
  for(const attr of ['disabled', 'disabled=""', 'disabled="disabled"']){
    test(`<lc-lightbox ${attr}> is disabled`, ()=>{
      const el = mount(`<lc-lightbox ${attr}>${IMG}</lc-lightbox>`)
      assertDisabled(el)
      el.querySelector('img').click()
      assert.equal(el.dataset.lcOpen, undefined)
    })
  }

  test('no disabled attribute is enabled', ()=>{
    const el = mount(`<lc-lightbox>${IMG}</lc-lightbox>`)
    assertEnabled(el)
    el.querySelector('img').click()
    assert.equal(el.shadowRoot.querySelector('dialog').open, true)
    assert.equal(el.dataset.lcOpen, 'open')
  })
})

describe('data-lc-open', ()=>{
  test('is removed when the dialog is closed by clicking it', ()=>{
    const el = mount(`<lc-lightbox>${IMG}</lc-lightbox>`)
    const dialog = el.shadowRoot.querySelector('dialog')
    el.querySelector('img').click()
    assert.equal(el.dataset.lcOpen, 'open')
    dialog.click()
    assert.equal(dialog.open, false)
    assert.equal(el.dataset.lcOpen, undefined)
  })

  test('is removed when the dialog is closed natively (Esc)', ()=>{
    const el = mount(`<lc-lightbox>${IMG}</lc-lightbox>`)
    const dialog = el.shadowRoot.querySelector('dialog')
    el.querySelector('img').click()
    assert.equal(el.dataset.lcOpen, 'open')
    // Esc calls the dialog's close steps directly, bypassing our click handler
    dialog.close()
    assert.equal(el.dataset.lcOpen, undefined)
  })

  test('is removed when the element is disconnected while open', ()=>{
    const el = mount(`<lc-lightbox>${IMG}</lc-lightbox>`)
    el.querySelector('img').click()
    el.remove()
    assert.equal(el.dataset.lcOpen, undefined)
  })
})

describe('min-width attribute', ()=>{
  test('default min-width disables the lightbox on a narrow viewport', ()=>{
    window.happyDOM.setViewport({ width: 400, height: 768 })
    const el = mount(`<lc-lightbox>${IMG}</lc-lightbox>`)
    assertDisabled(el)
  })

  test('min-width="0" enables the lightbox on a narrow viewport', ()=>{
    window.happyDOM.setViewport({ width: 400, height: 768 })
    const el = mount(`<lc-lightbox min-width="0">${IMG}</lc-lightbox>`)
    assertEnabled(el)
  })

  test('min-width larger than the viewport disables the lightbox', ()=>{
    const el = mount(`<lc-lightbox min-width="5000">${IMG}</lc-lightbox>`)
    assertDisabled(el)
  })

  test('non-numeric min-width falls back to the default', ()=>{
    window.happyDOM.setViewport({ width: 400, height: 768 })
    const el = mount(`<lc-lightbox min-width="wide">${IMG}</lc-lightbox>`)
    assertDisabled(el)
  })
})

describe('lightbox image loading', ()=>{
  test('src is not set until the lightbox is opened', ()=>{
    const el = mount(`<lc-lightbox src="big.jpg">${IMG}</lc-lightbox>`)
    const lightbox_image = el.shadowRoot.querySelector('.image')
    assert.equal(lightbox_image.getAttribute('src'), null)
    el.querySelector('img').click()
    assert.equal(lightbox_image.getAttribute('src'), 'big.jpg')
  })

  test('falls back to the thumbnail src', ()=>{
    const el = mount(`<lc-lightbox>${IMG}</lc-lightbox>`)
    el.querySelector('img').click()
    const lightbox_image = el.shadowRoot.querySelector('.image')
    assert.equal(lightbox_image.src, el.querySelector('img').src)
  })
})

describe('package.json', ()=>{
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)))

  test('main matches exports', ()=>{
    assert.equal(pkg.main.replace(/^\.\//, ''), pkg.exports.replace(/^\.\//, ''))
  })

  test('main file is copied into the package by the build', ()=>{
    // build.bash copies src/<file> to the package root
    assert.ok(existsSync(new URL(`../src/${pkg.main}`, import.meta.url)))
  })
})

describe('module loading', ()=>{
  test('importing the module a second time does not throw', async ()=>{
    await assert.doesNotReject(import('../src/lc-lightbox.js?again'))
  })
})

describe('custom template', ()=>{
  test('missing .container/.image logs an error instead of throwing', ()=>{
    const error = mock.method(console, 'error', ()=>{})
    const template = document.createElement('template')
    template.id = 'low-cal-template'
    template.innerHTML = '<slot></slot>'
    document.head.appendChild(template)

    assert.doesNotThrow(()=>mount(`<lc-lightbox>${IMG}</lc-lightbox>`))
    assert.equal(error.mock.callCount(), 1)
  })
})
