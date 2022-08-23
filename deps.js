/*
// deps.js
export * as Lit from './lib/lit.js';

// consumer.js
import { Lit } from './deps.js';
const { LitElement, html, css, svg } = Lit;
 */
//import './lib/@spectrum-web-components/button/sp-button.js';
export * as Lit from './lib/lit.js';
/* ref 
 * export { Remarkable, util }
 * https://github.com/jonschlinkert/remarkable
 * https://unpkg.com/remarkable@2.0.1/dist/esm/index.browser.js
 ? https://unpkg.com/browse/remarkable@2.0.1/dist/esm/linkify.js
 */
export * as markdown from './lib/remarkable.js';
