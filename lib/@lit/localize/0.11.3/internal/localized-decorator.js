/* https://unpkg.com/@lit/localize@0.11.3/internal/localized-decorator.js?module */ /**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { updateWhenLocaleChanges } from "./localized-controller.js";
/**
                                                                             * Class decorator to enable re-rendering the given LitElement whenever a new
                                                                             * active locale has loaded.
                                                                             *
                                                                             * See also {@link updateWhenLocaleChanges} for the same functionality without
                                                                             * the use of decorators.
                                                                             *
                                                                             * When using lit-localize in transform mode, applications of this decorator are
                                                                             * removed.
                                                                             *
                                                                             * Usage:
                                                                             *
                                                                             *   import {LitElement, html} from 'lit';
                                                                             *   import {customElement} from 'lit/decorators.js';
                                                                             *   import {msg, localized} from '@lit/localize';
                                                                             *
                                                                             *   @localized()
                                                                             *   @customElement('my-element')
                                                                             *   class MyElement extends LitElement {
                                                                             *     render() {
                                                                             *       return html`<b>${msg('Hello World')}</b>`;
                                                                             *     }
                                                                             *   }
                                                                             */
const _localized = () => classOrDescriptor => typeof classOrDescriptor === 'function' ?
legacyLocalized(classOrDescriptor) :
standardLocalized(classOrDescriptor);
export const localized = _localized;
const standardLocalized = ({ kind, elements }) => {
  return {
    kind,
    elements,
    finisher(clazz) {
      clazz.addInitializer(updateWhenLocaleChanges);
    } };

};
const legacyLocalized = clazz => {
  clazz.addInitializer(updateWhenLocaleChanges);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return clazz;
};