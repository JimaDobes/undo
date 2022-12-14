/* https://unpkg.com/@spectrum-web-components/button@0.17.7/src/Button.js?module */ /*
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
import { SizedMixin } from "../../../base.js";
import { property } from "../../../base/0.5.8/src/decorators.js";
import { StyledButton } from "./StyledButton.js";
import buttonStyles from "./button.css.js";
export const VALID_VARIANTS = [
'accent',
'primary',
'secondary',
'negative',
'white',
'black'];

/**
           * @element sp-button
           *
           * @slot - text label of the Button
           * @slot icon - The icon to use for Button
           */
export class Button extends SizedMixin(StyledButton) {
  constructor() {
    super(...arguments);
    this._variant = 'accent';
    /**
                               * The visual variant to apply to this button.
                               */
    this.treatment = 'fill';
  }
  static get styles() {
    return [...super.styles, buttonStyles];
  }
  /**
     * The visual variant to apply to this button.
     */
  get variant() {
    return this._variant;
  }
  set variant(variant) {
    if (variant === this.variant)
    return;
    this.requestUpdate('variant', this.variant);
    switch (variant) {
      case 'cta':
        this._variant = 'accent';
        break;
      case 'overBackground':
        this._variant = 'white';
        this.treatment = 'outline';
        break;
      default:
        if (!VALID_VARIANTS.includes(variant)) {
          this._variant = 'accent';
        } else
        {
          this._variant = variant;
        }
        break;}

    this.setAttribute('variant', this.variant);
  }
  /**
     * Style this button to be less obvious
     */
  set quiet(quiet) {
    this.treatment = quiet ? 'outline' : 'fill';
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    if (!this.hasAttribute('variant')) {
      this.setAttribute('variant', this.variant);
    }
  }}

__decorate([
property()],
Button.prototype, "variant", null);
__decorate([
property({ reflect: true })],
Button.prototype, "treatment", void 0);
__decorate([
property({ type: Boolean })],
Button.prototype, "quiet", null);