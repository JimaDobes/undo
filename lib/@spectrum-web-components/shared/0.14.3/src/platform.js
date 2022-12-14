/* https://unpkg.com/@spectrum-web-components/shared@0.14.3/src/platform.js?module */ /*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
function testUserAgent(re) {
  return typeof window !== 'undefined' && window.navigator != null ?
  re.test(window.navigator.userAgent) :
  false;
}
function testPlatform(re) {
  return typeof window !== 'undefined' && window.navigator != null ?
  re.test(window.navigator.platform) :
  false;
}
/* c8 ignore next 3 */
export function isMac() {
  return testPlatform(/^Mac/);
}
export function isIPhone() {
  return testPlatform(/^iPhone/);
}
export function isIPad() {
  return testPlatform(/^iPad/) ||
  // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
export function isIOS() {
  return isIPhone() || isIPad();
}
/* c8 ignore next 3 */
export function isAppleDevice() {
  return isMac() || isIOS();
}
/* c8 ignore next 3 */
export function isWebKit() {
  return testUserAgent(/AppleWebKit/) && !isChrome();
}
/* c8 ignore next 3 */
export function isChrome() {
  return testUserAgent(/Chrome/);
}
export function isAndroid() {
  return testUserAgent(/Android/);
}