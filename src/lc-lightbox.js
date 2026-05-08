
const default_template = document.createElement('template');
default_template.innerHTML = `
  <!-- lightbox template -->
  <style>
    :host{
      --image-border-width: 1rem;
      --dialog-padding: 1rem;
      overflow: hidden;
    }
    *{
      box-sizing: border-box;
    }
    dialog:focus-visible{
      outline: none;
    }
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.9);
    }
    dialog {
      cursor: zoom-out;
      padding: var(--image-border-width);
      border: none;
      margin: auto;
    }
    img {
        max-height:  calc(100vh - var(--image-border-width) - 60px);
        max-width: 100%;
        background-color: white;
    }
    dialog, ::backdrop {
      transition: 
        display 0.5s allow-discrete, 
        overlay 0.5s allow-discrete,
        opacity 0.5s;
      opacity: 0;
    }
    /* IN */
    [open], [open]::backdrop {
      opacity: 1;
    }
    
    /* OUT */
    @starting-style {
      [open], [open]::backdrop {
        opacity: 0;
      }
    }
    
  </style>
  <slot></slot>
  <dialog class="container">
    <img class="image">
  </dialog>
  <!-- /lightbox template -->
`

export class LCLightbox extends HTMLElement {
  min_width = 640

  constructor(){
    super()
  }

  connectedCallback(){
    const disabled = this.getAttribute('disabled')
    const min_width = Number(this.getAttribute('min-width')) || this.min_width
    if(disabled || window.innerWidth < min_width){
      return
    }

    const thumbnail_image = this.querySelector('img')
    if(!thumbnail_image){
      return
    }
    thumbnail_image.style.cursor = 'zoom-in'

    const shadow = this.shadowRoot || this.attachShadow({ mode: "open" })
    shadow.innerHTML = ''
    const custom_template = document.querySelector('template#low-cal-template')
    if(custom_template){
      shadow.appendChild(custom_template.content.cloneNode(true))
    }
    else{
      shadow.appendChild(default_template.content.cloneNode(true))
    }
    const lightbox = shadow.querySelector('.container')

    let src = this.getAttribute('src')
    if(!src){
      src = thumbnail_image.src
    }
    const lightbox_image = lightbox.querySelector('.image')
    lightbox_image.src = src
    lightbox_image.alt = thumbnail_image.alt || ''

    this._onThumbnailClick = ()=>{
      lightbox.showModal()
      this.dataset.lcOpen = 'open'
    }
    this._onLightboxClick = ()=>{
      lightbox.close()
      delete this.dataset.lcOpen
    }

    thumbnail_image.addEventListener('click', this._onThumbnailClick)
    lightbox.addEventListener('click', this._onLightboxClick)

    this._thumbnail_image = thumbnail_image
    this._lightbox = lightbox

    const debug = this.getAttribute('debug')
    if(debug === 'templates'){
      if(custom_template){
        console.log('Using a custom template\n\n', custom_template.outerHTML)
      }
      else{
        console.log('Using the default template\n\n', default_template.outerHTML)
      }
      console.log('Lightbox html\n\n', lightbox.outerHTML)
    }
  }

  disconnectedCallback(){
    if(this._thumbnail_image){
      this._thumbnail_image.removeEventListener('click', this._onThumbnailClick)
    }
    if(this._lightbox){
      this._lightbox.removeEventListener('click', this._onLightboxClick)
    }
  }
}

customElements.define('lc-lightbox', LCLightbox)
