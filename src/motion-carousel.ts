import type { PropertyValueMap } from 'lit'
import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'

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
  curIndex = 1

  @query('slot[name="cur"]', true)
  curSlots!: HTMLSlotElement

  @query('slot[name="prev"]', true)
  prevSlots!: HTMLSlotElement

  get maxIndex() {
    return this.children.length - 1
  }

  private prevIndex = 0

  hasValidIndex() {
    return this.curIndex >= 0 && this.curIndex <= this.maxIndex
  }

  handleClick(e: MouseEvent) {
    this.curIndex = this.curIndex + (e.shiftKey ? -1 : 1)
    this.curIndex = this.curIndex >= this.maxIndex ? this.maxIndex : this.curIndex <= 0 ? 0 : this.curIndex
    // lit中如果是由于用户交互行为导致propert改变，需要手动dispatch一个event出去
    const event = new CustomEvent('change', { bubbles: true, composed: true, detail: this.curIndex })
    this.dispatchEvent(event)
  }

  // 在元素更新完毕后调用，可以获取到更新后的dom1的元素
  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('curIndex') && this.hasValidIndex()) {
      this.updateSlots()
      this.prevIndex = this.curIndex
    }
  }

  updateSlots() {
    /* 先把插槽内的内容清空 */
    this.curSlots.assignedElements()[0]?.removeAttribute('slot')
    this.prevSlots.assignedElements()[0]?.removeAttribute('slot')
    /* 根据现在的index显示对应的图片 */
    this.children[this.prevIndex].setAttribute('slot', 'previous')
    this.children[this.curIndex].setAttribute('slot', 'cur')
  }

  render() {
    const animateLeft = ''
    const curLeft = ''
    const prevLeft = ''
    return html`
      <div class="w-100% h-100% pos-relative shadow" @click=${this.handleClick} style=${styleMap({ left: animateLeft })}>
          <div class="w-100% h-100% pos-relative" style=${styleMap({ left: curLeft })}>
             <slot name="prev"></slot>
          </div>
          <div class="w-100% h-100% pos-relative top--100%" style=${styleMap({ left: prevLeft })}>
             <slot name="cur"></slot>
          </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'motion-carousel': MotionCarousel
  }
}
