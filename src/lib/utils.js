import { addEvent, removeEvent } from "./eventManager";

export const FALSY_VALUES = [null, undefined, true, false];
export const PRIMITIVE_TYPES = ["string", "number"];

const normalizeEventName = (name) => name.replace(/^on/, "").toLowerCase();

export const attributeRules = {
  event: {
    condition: (name, value) =>
      name.startsWith("on") && typeof value === "function",
    apply: (element, key, value) =>
      addEvent(element, normalizeEventName(key), value),
    remove: (element, key, value) =>
      removeEvent(element, normalizeEventName(key), value),
  },
  class: {
    condition: (name, value) =>
      name.startsWith("class") && typeof value === "string",
    apply: (element, _, value) => element.setAttribute("class", value),
  },
};
