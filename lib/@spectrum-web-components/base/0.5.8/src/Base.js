/* https://unpkg.com/@spectrum-web-components/base@0.5.8/src/Base.js?module */ /*
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
import { LitElement } from "../../../../lit.js";
import { property } from "../../../../lit/2.1.2/decorators.js";
const observedForElements = new Set();
const updateRTL = () => {
  const dir = document.documentElement.dir === 'rtl' ?
  document.documentElement.dir :
  'ltr';
  observedForElements.forEach(el => {
    el.setAttribute('dir', dir);
  });
};
const rtlObserver = new MutationObserver(updateRTL);
rtlObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['dir'] });

const canManageContentDirection = el => typeof el.startManagingContentDirection !== 'undefined' ||
el.tagName === 'SP-THEME';
export function SpectrumMixin(constructor) {
  class SlotTextObservingElement extends constructor {
    constructor() {
      super(...arguments);
      /**
                            * @private
                            */
      this.dir = 'ltr';
    }
    /**
       * @private
       */
    get isLTR() {
      return this.dir === 'ltr';
    }
    hasVisibleFocusInTree() {
      const activeElement = this.getRootNode().
      activeElement;
      if (!activeElement) {
        return false;
      }
      // Browsers without support for the `:focus-visible`
      // selector will throw on the following test (Safari, older things).
      // Some won't throw, but will be focusing item rather than the menu and
      // will rely on the polyfill to know whether focus is "visible" or not.
      try {
        return activeElement.matches(':focus-visible') ||
        activeElement.matches('.focus-visible');
      }
      catch (error) {
        return activeElement.matches('.focus-visible');
      }
    }
    connectedCallback() {
      if (!this.hasAttribute('dir')) {
        let dirParent = this.assignedSlot ||
        this.parentNode;
        while (dirParent !== document.documentElement &&
        !canManageContentDirection(dirParent)) {
          dirParent = dirParent.assignedSlot || // step into the shadow DOM of the parent of a slotted node
          dirParent.parentNode || // DOM Element detected
          dirParent.
          host;
        }
        const oldDir = this.dir;
        this.dir =
        dirParent.dir === 'rtl' ? dirParent.dir : this.dir || 'ltr';
        if (oldDir === this.dir) {
          this.setAttribute('dir', this.dir);
        }
        if (dirParent === document.documentElement) {
          observedForElements.add(this);
        } else
        {
          const { localName } = dirParent;
          if (localName.search('-') > -1 &&
          !customElements.get(localName)) {
            customElements.whenDefined(localName).then(() => {
              dirParent.startManagingContentDirection(this);
            });
          } else
          {
            dirParent.startManagingContentDirection(this);
          }
        }
        this._dirParent = dirParent;
      }
      super.connectedCallback();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._dirParent) {
        if (this._dirParent === document.documentElement) {
          observedForElements.delete(this);
        } else
        {
          this._dirParent.stopManagingContentDirection(this);
        }
        this.removeAttribute('dir');
      }
    }}

  __decorate([
  property({ reflect: true })],
  SlotTextObservingElement.prototype, "dir", void 0);
  return SlotTextObservingElement;
}
export class SpectrumElement extends SpectrumMixin(LitElement) {}