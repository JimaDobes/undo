/* https://unpkg.com/@spectrum-web-components/shared@0.14.3/src/observe-slot-text.js?module */ import { __decorate } from "../../../../tslib.js";
import { property, queryAssignedNodes } from "../../../base/0.5.8/src/decorators.js";
import { MutationController } from "../../../../@lit-labs/observers/1.0.1/mutation_controller.js";
const assignedNodesList = Symbol('assignedNodes');
export function ObserveSlotText(constructor, slotName) {
  var _a;
  class SlotTextObservingElement extends constructor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
      super(args);
      this.slotHasContent = false;
      new MutationController(this, {
        config: {
          characterData: true,
          subtree: true },

        callback: mutationsList => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'characterData') {
              this.manageTextObservedSlot();
              return;
            }
          }
        } });

    }
    manageTextObservedSlot() {
      if (!this[assignedNodesList])
      return;
      const assignedNodes = [...this[assignedNodesList]].filter(node => {
        if (node.tagName) {
          return true;
        }
        return node.textContent ? node.textContent.trim() : false;
      });
      this.slotHasContent = assignedNodes.length > 0;
    }
    update(changedProperties) {
      if (!this.hasUpdated) {
        const { childNodes } = this;
        const textNodes = [...childNodes].filter(node => {
          if (node.tagName) {
            return slotName ?
            node.getAttribute('slot') ===
            slotName :
            !node.hasAttribute('slot');
          }
          return node.textContent ? node.textContent.trim() : false;
        });
        this.slotHasContent = textNodes.length > 0;
      }
      super.update(changedProperties);
    }
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.manageTextObservedSlot();
    }}

  _a = assignedNodesList;
  __decorate([
  property({ type: Boolean, attribute: false })],
  SlotTextObservingElement.prototype, "slotHasContent", void 0);
  __decorate([
  queryAssignedNodes(slotName, true)],
  SlotTextObservingElement.prototype, _a, void 0);
  return SlotTextObservingElement;
}