import { addEvent, removeEvent } from "../event";

function handleEventAttribute(target, key, newValue, oldValue) {
  const eventType = key.slice(2).toLowerCase();
  if (oldValue !== newValue) {
    addEvent(target, eventType, newValue);
  }
}

function handleNormalAttribute(target, key, newValue, oldValue) {
  const attrName = key === "className" ? "class" : key;
  if (oldValue !== newValue) {
    target.setAttribute(attrName, newValue);
  }
}

function removeEventAttribute(target, key, oldValue) {
  const eventType = key.slice(2).toLowerCase();
  removeEvent(target, eventType, oldValue);
}

function removeNormalAttribute(target, key) {
  const attrName = key === "className" ? "class" : key;
  target.removeAttribute(attrName);
}

export function updateAttributes(
  target,
  originNewProps = {},
  originOldProps = {},
) {
  originNewProps &&
    Object.entries(originNewProps).forEach(([key, value]) => {
      const handler = key.startsWith("on")
        ? handleEventAttribute
        : handleNormalAttribute;
      handler(target, key, value, originOldProps[key]);
    });

  originOldProps &&
    Object.keys(originOldProps).forEach((key) => {
      if (!originNewProps || !(key in originNewProps)) {
        const handler = key.startsWith("on")
          ? removeEventAttribute
          : removeNormalAttribute;
        handler(target, key, originOldProps[key]);
      }
    });
}
