import type { PropertyValueMap } from 'lit'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('motion-carousel')
class MotionCarousel extends LitElement {
  static styles = css`
        :host{
            display:block;
            position: relative;
            overflow:hidden;
            width:800px;
            height:533px;
            border-radius:8px;
            background-color:red;
            cursor: pointer;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }

        ::slotted(*){
            object-fit:cover;
            width:100%;
            height:auto
        }
        @unocss-placeholder
    `
  @property({ type: Number })
  curIndex = 0

  get maxIndex() {
    return this.childElementCount - 1
  }

  hasValidIndex() {
    return this.curIndex >= 0 && this.curIndex <= this.maxIndex
  }

  private clickHandler(e: MouseEvent) {
    const i = this.curIndex + (Number(!e.shiftKey) || -1)
    this.curIndex = i > this.maxIndex ? 0 : i < 0 ? this.maxIndex : i
    const change = new CustomEvent('change',
      { detail: this.curIndex, bubbles: true, composed: true })
    this.dispatchEvent(change)
  }

  render() {
    if (this.hasValidIndex()) {
      //
    }
    return html`
            <div class="w-100% h-100% pos-relative" @click=${this.clickHandler}>
                <slot name="selected"></slot>
            </div>
        `
  }

  private prevIndex = 0

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    console.log('_changedProperties', _changedProperties)
    if (_changedProperties.has('curIndex') && this.hasValidIndex()) {
      this.updatedSlots()
      this.prevIndex = this.curIndex
    }
  }

  private updatedSlots() {
    console.log('this.children', this.children, this.prevIndex, this.curIndex)
    this.children[this.prevIndex].removeAttribute('slot')
    this.children[this.curIndex].setAttribute('slot', 'selected')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'motion-carousel': MotionCarousel
  }
}
