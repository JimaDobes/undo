/* https://unpkg.com/@spectrum-web-components/shared@0.14.3/src/reparent-children.js?module */ /*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
function restoreChildren(placeholderItems, srcElements, cleanupCallbacks = []) {
  for (let index = 0; index < srcElements.length; ++index) {
    const srcElement = srcElements[index];
    const placeholderItem = placeholderItems[index];
    const parentElement = placeholderItem.parentElement || placeholderItem.getRootNode();
    if (cleanupCallbacks[index]) {
      cleanupCallbacks[index](srcElement);
    }
    if (parentElement && parentElement !== placeholderItem) {
      parentElement.replaceChild(srcElement, placeholderItem);
    }
    delete placeholderItems[index];
  }
  return srcElements;
}
export const reparentChildren = (srcElements, destination, { position, prepareCallback } = { position: 'beforeend' }) => {
  let { length } = srcElements;
  if (length === 0) {
    return () => srcElements;
  }
  let step = 1;
  let index = 0;
  if (position === 'afterbegin' || position === 'afterend') {
    step = -1;
    index = length - 1;
  }
  const placeholderItems = new Array(length);
  const cleanupCallbacks = new Array(length);
  const placeholderTemplate = document.createComment('placeholder for reparented element');
  do {
    const srcElement = srcElements[index];
    if (prepareCallback) {
      cleanupCallbacks[index] = prepareCallback(srcElement);
    }
    placeholderItems[index] = placeholderTemplate.cloneNode();
    const parentElement = srcElement.parentElement || srcElement.getRootNode();
    if (parentElement && parentElement !== srcElement) {
      parentElement.replaceChild(placeholderItems[index], srcElement);
    }
    destination.insertAdjacentElement(position, srcElement);
    index += step;
  } while (--length > 0);
  return function () {
    return restoreChildren(placeholderItems, srcElements, cleanupCallbacks);
  };
};