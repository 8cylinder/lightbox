
const default_template = document.createElement('template');
default_template.innerHTML = `
  <!-- lightbox template -->
  <style>
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
      padding: var(--image-border-width, 1rem);
      border: none;
      margin: auto;
    }
    img {
        display: block;
        /* Fit inside the UA dialog max-height (100% - 2em - 6px) and its padding */
        max-height: calc(100dvh - 2 * var(--image-border-width, 1rem) - 2em - 6px);
        max-width: 100%;
        background-color: white;
    }
    /* Closed state, and what it fades out to */
    dialog, ::backdrop {
      transition:
        display 0.5s allow-discrete,
        overlay 0.5s allow-discrete,
        opacity 0.5s;
      opacity: 0;
    }
    /* Open state */
    [open], [open]::backdrop {
      opacity: 1;
    }

    /* Where the fade in starts from */
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

  connectedCallback(){
    const disabled = this.hasAttribute('disabled')
    let min_width = this.min_width
    if(this.hasAttribute('min-width')){
      const attr_min_width = Number(this.getAttribute('min-width'))
      if(Number.isFinite(attr_min_width)){
        min_width = attr_min_width
      }
    }
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
    const lightbox_image = lightbox?.querySelector('.image')
    if(!lightbox || !lightbox_image){
      console.error('lc-lightbox: template must contain a dialog with class "container" and an img with class "image"')
      return
    }

    lightbox_image.alt = thumbnail_image.alt || ''
    lightbox.setAttribute('aria-label', thumbnail_image.alt || 'Image')
    thumbnail_image.tabIndex = 0
    thumbnail_image.setAttribute('role', 'button')

    this._onThumbnailClick = ()=>{
      // Set the src on first open so full size images aren't downloaded
      // until they are needed
      if(!lightbox_image.getAttribute('src')){
        let src = this.getAttribute('src')
        if(!src){
          // currentSrc is the source actually chosen from srcset/<picture>
          src = thumbnail_image.currentSrc || thumbnail_image.src
        }
        lightbox_image.src = src
      }
      lightbox.showModal()
      this.dataset.lcOpen = 'open'
    }
    this._onThumbnailKeydown = (event)=>{
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault()
        this._onThumbnailClick()
      }
    }
    this._onLightboxClick = ()=>{
      lightbox.close()
    }
    // Fires for any close, including the Esc key
    this._onLightboxClose = ()=>{
      delete this.dataset.lcOpen
    }

    thumbnail_image.addEventListener('click', this._onThumbnailClick)
    thumbnail_image.addEventListener('keydown', this._onThumbnailKeydown)
    lightbox.addEventListener('click', this._onLightboxClick)
    lightbox.addEventListener('close', this._onLightboxClose)

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
      this._thumbnail_image.removeEventListener('keydown', this._onThumbnailKeydown)
    }
    if(this._lightbox){
      this._lightbox.removeEventListener('click', this._onLightboxClick)
      this._lightbox.removeEventListener('close', this._onLightboxClose)
    }
    delete this.dataset.lcOpen
  }
}

if(!customElements.get('lc-lightbox')){
  customElements.define('lc-lightbox', LCLightbox)
}
