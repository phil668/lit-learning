import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('prop-attr')
class PropAttr extends LitElement {
  @property({ attribute: 'liuyue' })
    name: string = 'liuyue'

  @state()
    age: number = 123

  render() {
    return html`
            <div>hello i am ${this.name}</div>
        `
  }
}
