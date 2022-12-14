/* https://unpkg.com/@spectrum-web-components/button@0.17.7/src/ButtonBase.js?module */ /*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { __decorate } from "../../../../tslib.js";
import { html } from "../../../base.js";
import { property, query } from "../../../base/0.5.8/src/decorators.js";
import { LikeAnchor } from "../../../shared/0.14.3/src/like-anchor.js";
import { Focusable } from "../../../shared/0.14.3/src/focusable.js";
import { ObserveSlotPresence, ObserveSlotText } from "../../../shared.js";
/**
                                                                                                                          * @slot - text content to be displayed in the Button element
                                                                                                                          * @slot icon - icon element(s) to display at the start of the button
                                                                                                                          */
export class ButtonBase extends LikeAnchor(ObserveSlotText(ObserveSlotPresence(Focusable, '[slot="icon"]'))) {
  constructor() {
    super();
    this.active = false;
    this.type = 'button';
    this.proxyFocus = this.proxyFocus.bind(this);
    this.addEventListener('click', this.handleClickCapture, {
      capture: true });

  }
  get hasIcon() {
    return this.slotContentIsPresent;
  }
  get hasLabel() {
    return this.slotHasContent;
  }
  get focusElement() {
    return this;
  }
  get buttonContent() {
    const content = [
    html`
                <div id="label" ?hidden=${!this.hasLabel}>
                    <slot
                        id="slot"
                        @slotchange=${this.manageTextObservedSlot}
                    ></slot>
                </div>
            `];

    if (this.hasIcon) {
      content.unshift(html`
                <slot name="icon" ?icon-only=${!this.hasLabel}></slot>
            `);
    }
    return content;
  }
  click() {
    if (this.disabled) {
      return;
    }
    if (this.shouldProxyClick()) {
      return;
    }
    super.click();
  }
  handleClickCapture(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      return false;
    }
  }
  proxyFocus() {
    this.focus();
  }
  shouldProxyClick() {
    let handled = false;
    if (this.anchorElement) {
      this.anchorElement.click();
      handled = true;
    } else
    if (this.type !== 'button') {
      const proxy = document.createElement('button');
      proxy.type = this.type;
      this.insertAdjacentElement('afterend', proxy);
      proxy.click();
      proxy.remove();
      handled = true;
    }
    return handled;
  }
  renderAnchor() {
    return html`
            ${this.buttonContent}
            ${super.renderAnchor({
      id: 'button',
      ariaHidden: true,
      className: 'button anchor hidden' })
    }
        `;
  }
  renderButton() {
    return html`
            ${this.buttonContent}
        `;
  }
  render() {
    return this.href && this.href.length > 0 ?
    this.renderAnchor() :
    this.renderButton();
  }
  handleKeydown(event) {
    const { code } = event;
    switch (code) {
      case 'Space':
        event.preventDefault();
        if (typeof this.href === 'undefined') {
          this.addEventListener('keyup', this.handleKeyup);
          this.active = true;
        }
        break;
      default:
        break;}

  }
  handleKeypress(event) {
    const { code } = event;
    switch (code) {
      case 'Enter':
      case 'NumpadEnter':
        this.click();
        break;
      default:
        break;}

  }
  handleKeyup(event) {
    const { code } = event;
    switch (code) {
      case 'Space':
        this.removeEventListener('keyup', this.handleKeyup);
        this.active = false;
        this.click();
        break;
      default:
        break;}

  }
  handleRemoveActive() {
    this.active = false;
  }
  handlePointerdown() {
    this.active = true;
  }
  manageAnchor() {
    if (this.href && this.href.length > 0) {
      if (this.getAttribute('role') === 'button') {
        this.setAttribute('role', 'link');
      }
      this.removeEventListener('click', this.shouldProxyClick);
    } else
    {
      if (!this.hasAttribute('role') ||
      this.getAttribute('role') === 'link') {
        this.setAttribute('role', 'button');
      }
      this.addEventListener('click', this.shouldProxyClick);
    }
  }
  firstUpdated(changed) {
    super.firstUpdated(changed);
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
    this.manageAnchor();
    this.addEventListener('keydown', this.handleKeydown);
    this.addEventListener('keypress', this.handleKeypress);
    this.addEventListener('pointerdown', this.handlePointerdown);
  }
  updated(changed) {
    super.updated(changed);
    if (changed.has('href')) {
      this.manageAnchor();
    }
    if (changed.has('label')) {
      this.setAttribute('aria-label', this.label || '');
    }
    if (changed.has('active')) {
      if (this.active) {
        this.addEventListener('focusout', this.handleRemoveActive);
        this.addEventListener('pointerup', this.handleRemoveActive);
        this.addEventListener('pointerleave', this.handleRemoveActive);
      } else
      {
        this.removeEventListener('focusout', this.handleRemoveActive);
        this.removeEventListener('pointerup', this.handleRemoveActive);
        this.removeEventListener('pointerleave', this.handleRemoveActive);
      }
    }
    if (this.anchorElement) {
      this.anchorElement.addEventListener('focus', this.proxyFocus);
      this.anchorElement.tabIndex = -1;
    }
  }}

__decorate([
property({ type: Boolean, reflect: true })],
ButtonBase.prototype, "active", void 0);
__decorate([
property({ type: String })],
ButtonBase.prototype, "type", void 0);
__decorate([
query('.anchor')],
ButtonBase.prototype, "anchorElement", void 0);