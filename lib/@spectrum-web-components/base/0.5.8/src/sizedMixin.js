/* https://unpkg.com/@spectrum-web-components/base@0.5.8/src/sizedMixin.js?module */ import { __decorate } from "../../../../tslib.js";
import { property } from "../../../../lit/2.1.2/decorators.js";
export const ElementSizes = {
  xxs: 'xxs',
  xs: 'xs',
  s: 's',
  m: 'm',
  l: 'l',
  xl: 'xl',
  xxl: 'xxl' };

export function SizedMixin(constructor, { validSizes = ['s', 'm', 'l', 'xl'], noDefaultSize, defaultSize = 'm' } = {}) {
  class SizedElement extends constructor {
    constructor() {
      super(...arguments);
      this._size = defaultSize;
    }
    get size() {
      return this._size || defaultSize;
    }
    set size(value) {
      const fallbackSize = noDefaultSize ? null : defaultSize;
      const size = value ? value.toLocaleLowerCase() : value;
      const validSize = validSizes.includes(size) ? size : fallbackSize;
      if (validSize) {
        this.setAttribute('size', validSize);
      }
      if (this._size === validSize) {
        return;
      }
      const oldSize = this._size;
      this._size = validSize;
      this.requestUpdate('size', oldSize);
    }
    update(changes) {
      if (!this.hasAttribute('size') && !noDefaultSize) {
        this.setAttribute('size', this.size);
      }
      super.update(changes);
    }}

  __decorate([
  property({ type: String, reflect: true })],
  SizedElement.prototype, "size", null);
  return SizedElement;
}