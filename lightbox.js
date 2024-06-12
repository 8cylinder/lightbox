/* <image-lightbox>
 *
 *
 * Usage:
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

customElements.define(
  'image-lightbox',
  class extends HTMLElement {
    static observedAttributes = ['src', 'min-width', 'disabled']
    min_width = 640

    styles = `
      .lightbox-container{
        display: grid;
        place-content: center;
        position: fixed;
        top: 0;
        left: 0;
        height: 100dvh;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        padding: 1rem;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .showing{
        opacity: 1;
      }
      .lightbox-container img{
        max-height: 100%;
        margin: auto;
      }
      .lightbox-container, .lightbox-image{
        cursor: zoom-out;
      }
    `

    constructor(){
      self = super()

      const DISABLED = this.getAttribute('disabled')
      this.DISABLED = DISABLED
      const MIN_WIDTH = this.getAttribute('min-width') || this.min_width
      this.MIN_WIDTH = MIN_WIDTH
      if(DISABLED || window.innerWidth < this.MIN_WIDTH){
        return
      }

      const thumbnail_image = this.querySelector('img')
      thumbnail_image.style.cursor = 'zoom-in'
      this.thumbnail_image = thumbnail_image
    }

    connectedCallback(){
      if(this.DISABLED || window.innerWidth < this.MIN_WIDTH){
        return
      }

      let src = this.getAttribute('src')
      if(! src){
        src = this.thumbnail_image.src
      }

      const lightbox = document.createElement('div')
      lightbox.setAttribute('class', 'lightbox-container')

      const img = document.createElement('img')
      img.setAttribute('src', src)
      img.setAttribute('class', 'lightbox-image')

      const style = document.createElement("style")
      style.textContent = this.styles

      lightbox.appendChild(style)
      lightbox.appendChild(img)

      let direction = 'open'

      this.thumbnail_image.addEventListener('click', ()=>{
        this.thumbnail_image.style.cursor = 'zoom-in'
        this.appendChild(lightbox)

        // if setTimeout is not used, the transition does not fire
        setTimeout(() => {
          lightbox.classList.toggle('showing')
          direction = 'open'
        }, 1);
      })

      lightbox.addEventListener('click', ()=>{
        lightbox.classList.toggle('showing')
        direction = 'close'
      })

      lightbox.addEventListener('transitionend', ()=>{
        if(direction == 'close'){
          lightbox.remove()
        }
      })
    }
  }
)
