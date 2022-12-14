/* https://unpkg.com/@spectrum-web-components/shared@0.14.3/src/observe-slot-presence.js?module */ import { MutationController } from "../../../../@lit-labs/observers/1.0.1/mutation_controller.js";
const slotContentIsPresent = Symbol('slotContentIsPresent');
export function ObserveSlotPresence(constructor, lightDomSelector) {
  var _a;
  const lightDomSelectors = Array.isArray(lightDomSelector) ?
  lightDomSelector :
  [lightDomSelector];
  class SlotPresenceObservingElement extends constructor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
      super(args);
      this[_a] = new Map();
      this.managePresenceObservedSlot = () => {
        let changes = false;
        lightDomSelectors.forEach(selector => {
          const nextValue = !!this.querySelector(selector);
          const previousValue = this[slotContentIsPresent].get(selector) || false;
          changes = changes || previousValue !== nextValue;
          this[slotContentIsPresent].set(selector, !!this.querySelector(selector));
        });
        if (changes)
        this.requestUpdate();
      };
      new MutationController(this, {
        config: {
          childList: true,
          subtree: true },

        callback: () => {
          this.managePresenceObservedSlot();
        } });

      this.managePresenceObservedSlot();
    }
    /**
       *  @private
       */
    get slotContentIsPresent() {
      if (lightDomSelectors.length === 1) {
        return this[slotContentIsPresent].get(lightDomSelectors[0]) ||
        false;
      } else
      {
        throw new Error('Multiple selectors provided to `ObserveSlotPresence` use `getSlotContentPresence(selector: string)` instead.');
      }
    }
    getSlotContentPresence(selector) {
      if (this[slotContentIsPresent].has(selector)) {
        return this[slotContentIsPresent].get(selector) || false;
      }
      throw new Error(`The provided selector \`${selector}\` is not being observed.`);
    }}

  _a = slotContentIsPresent;
  return SlotPresenceObservingElement;
}