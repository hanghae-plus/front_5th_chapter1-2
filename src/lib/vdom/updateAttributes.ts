import { addEvent, removeEvent } from "../event";
import { Props } from "./types";

function handleEventAttribute(
  target: HTMLElement,
  key: string,
  newValue: string,
  oldValue: string,
) {
  const eventType = key.slice(2).toLowerCase();
  if (oldValue !== newValue) {
    addEvent(target, eventType, newValue);
  }
}

function handleNormalAttribute(
  target: HTMLElement,
  key: string,
  newValue: string,
  oldValue: string,
) {
  const attrName = key === "className" ? "class" : key;
  if (oldValue !== newValue) {
    target.setAttribute(attrName, newValue);
  }
}

function removeEventAttribute(
  target: HTMLElement,
  key: string,
  oldValue: string,
) {
  const eventType = key.slice(2).toLowerCase();
  removeEvent(target, eventType, oldValue);
}

function removeNormalAttribute(target: HTMLElement, key: string) {
  const attrName = key === "className" ? "class" : key;
  target.removeAttribute(attrName);
}

export function updateAttributes(
  target: HTMLElement,
  originNewProps: Props,
  originOldProps: Props,
) {
  if (originNewProps) {
    Object.entries(originNewProps).forEach(([key, value]) => {
      const handler = key.startsWith("on")
        ? handleEventAttribute
        : handleNormalAttribute;
      handler(target, key, value, originOldProps?.[key] || "");
    });
  }

  if (originOldProps) {
    Object.keys(originOldProps).forEach((key) => {
      if (!(originNewProps && key in originNewProps)) {
        const handler = key.startsWith("on")
          ? removeEventAttribute
          : removeNormalAttribute;
        handler(target, key, originOldProps[key]);
      }
    });
  }
}
