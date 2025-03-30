import { addEvent, removeEvent } from "../lib/eventManager";

export function updateAttributes($el, props, prevProps) {
  if (prevProps) {
    Object.entries(prevProps).forEach(([key, value]) => {
      if (key.startsWith("on") && typeof value === "function") {
        const eventType = key.slice(2).toLowerCase();
        removeEvent($el, eventType, value);
      }
    });
  }
  const setAttributes = ([key, value]) => {
    if (key === "className") key = "class";
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else $el.setAttribute(key, value);
  };
  Object.entries(props).forEach(setAttributes);
}
