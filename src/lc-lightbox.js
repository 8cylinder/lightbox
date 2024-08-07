/* <image-lightbox>
 *
 *
 * Usage:
 *
 * The image-lightbox element will use its own template unless a template
 * exists with the id 'low-cal-template'.
 *
 * With no attributes, the image src will be used for the lightbox
 * image.
 *
 *   <image-lightbox>
 *     <img src="somewhere/over/the/rainbow.jpg">
 *   </image-lightbox>
 *
 *
 * Optional attributes are:
 *
 *   src:
 *    An alternative image to use for the lightbox image.  Mostly
 *    so a larger image can be used for the lightbox images.
 *
 *   min-width (default 640):
 *    the min width the lightbox will work.  This is so it is disabled
 *    for mobile where this isn't necessary.
 *
 *   disabled:
 *    if any value is used, the image-lightbox will be disabled.
 *
 *   <image-lightbox src="a/bigger/image.jpg" min-width="300" disabled="disabled">
 *     <img src="somewhere/over/the/rainbow.jpg">
 *   </image-lightbox>
 *
 */

const default_template = document.createElement('template');
default_template.innerHTML = `
  <!-- lightbox template -->
  <style>
    *{
      box-sizing: border-box;
    }
    .container{
      display: none;
      place-content: center;
      cursor: zoom-out;
      position: fixed;
      top: 0;
      left: 0;
      height: 100dvh;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      padding: 2rem;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 99999;
      & img{
        max-height: 100%;
        max-width: 100%;
        margin: auto;
        background-color: white;
      }
    }
    .showing{
      opacity: 1;
    }
  </style>
  <slot></slot>
  <div class="container">
    <img class="image">
  </div>
  <!-- /lightbox template -->
`

class LCLightbox extends HTMLElement {
  static observedAttributes = ['src', 'min-width', 'disabled', 'debug']
  min_width = 640

  constructor(){
    self = super()

    const DISABLED = this.getAttribute('disabled')
    this.DISABLED = DISABLED
    const MIN_WIDTH = this.getAttribute('min-width') || this.min_width
    this.MIN_WIDTH = MIN_WIDTH
    if(DISABLED || window.innerWidth < this.MIN_WIDTH){
      return
    }
    const DEBUG = this.getAttribute('debug')
    this.DEBUG = DEBUG

    const thumbnail_image = this.querySelector('img')
    thumbnail_image.style.cursor = 'zoom-in'
    // set the cursor here so that disabled lightboxes don't get a
    // zoom cursor
    this.thumbnail_image = thumbnail_image
  }

  connectedCallback(){
    if(this.DISABLED || window.innerWidth < this.MIN_WIDTH){
      return
    }

    const shadow = this.attachShadow({ mode: "open" });
    const custom_template = document.querySelector('template#low-cal-template')
    if(custom_template){
      const template_content = custom_template.content
      shadow.appendChild(template_content.cloneNode(true))
    }
    else{
      shadow.appendChild(default_template.content.cloneNode(true))
    }
    const lightbox = shadow.querySelector('.container')

    let src = this.getAttribute('src')
    if(! src){
      src = this.thumbnail_image.src
    }
    const lightbox_image = lightbox.querySelector('.image')
    lightbox_image.src = src

    let direction = 'open'

    this.thumbnail_image.addEventListener('click', ()=>{
      lightbox.style.display = 'grid'

      // if setTimeout is not used, the transition does not fire.
      setTimeout(() => {
        lightbox.classList.add('showing')
        direction = 'open'
      }, 10);
    })

    lightbox.addEventListener('click', ()=>{
      lightbox.classList.remove('showing')
      direction = 'close'
    })

    lightbox.addEventListener('transitionend', ()=>{
      if(direction == 'close'){
        lightbox.style.display = 'none'
      }
    })

    if(this.DEBUG == 'templates'){
      try{
        console.log('Using a custom template\n\n', custom_template.outerHTML)
      }
      catch{
        console.log('Using the default template\n\n', default_template.outerHTML)
      }
      console.log('Lightbox html\n\n', lightbox.outerHTML)
    }
  }
}
customElements.define('lc-lightbox', LCLightbox)
