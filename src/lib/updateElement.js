import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { isCheckStartOn, normalizeEventName } from "../utils/eventUtils.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const [attribute, value] of Object.entries(originNewProps)) {
    if (originOldProps[attribute] === value) continue;

    if (isCheckStartOn(attribute)) {
      addEvent(target, normalizeEventName(attribute), value);
    } else if (attribute === "className") {
      target.setAttribute("class", value);
    } else {
      target.setAttribute(attribute, value);
    }
  }

  for (const attribute of Object.keys(originOldProps)) {
    if (!(attribute in originNewProps)) {
      if (isCheckStartOn(attribute)) {
        removeEvent(target, normalizeEventName(attribute));
      } else {
        target.removeAttribute(attribute);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.children[index]);
  }

  if (!oldNode && newNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  if (typeof newNode === "string" || typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  updateAttributes(
    parentElement?.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  const childrenLengthMax = Math.max(
    newNode.children.length,
    oldNode.children.length,
  );

  for (let i = 0; i < childrenLengthMax; i++) {
    updateElement(
      parentElement?.children[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
