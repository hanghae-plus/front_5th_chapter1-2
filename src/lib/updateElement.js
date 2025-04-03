import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps, oldProps) {
  const newPropsBundle = newProps ? Object.entries(newProps) : [];
  const oldPropsBundle = oldProps ? Object.entries(oldProps) : [];

  for (const [prop, value] of oldPropsBundle) {
    let newPropValue = newProps[prop];

    if (isEventProp(prop)) {
      removeEvent(target, normalizeEventNape(prop), value);
      newPropValue = newProps[normalizeEventNape(prop)];
    }

    if (newPropValue === undefined) {
      target.removeAttribute(prop);
      continue;
    }

    if (value !== newPropValue) {
      if (isClassProp(prop)) {
        target.classList = newPropValue;
        continue;
      }
      if (isEventProp(prop)) {
        addEvent(target, normalizeEventNape(prop), newPropValue);
        continue;
      }
      target.setAttribute(prop, newPropValue);
      continue;
    }
  }

  for (const [prop, value] of newPropsBundle) {
    if (oldPropsBundle[prop] === undefined) {
      if (isEventProp(prop)) {
        addEvent(target, normalizeEventNape(prop), value);
        return;
      }
      if (isClassProp(prop)) {
        target.classList = value;
        continue;
      }
      target.setAttribute(prop, value);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentChildNodes = parentElement.childNodes[index];
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (oldNode && !newNode) {
    parentElement.removeChild(currentChildNodes);
    return;
  }

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      currentChildNodes.textContent = newNode;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), currentChildNodes);
    return;
  }

  updateAttributes(currentChildNodes, newNode.props || {}, oldNode.props || {});

  const newNodeDepth = newNode.children.length;
  const oldNodeDepth = oldNode.children.length;

  const depth = newNodeDepth >= oldNodeDepth ? newNodeDepth : oldNodeDepth;
  if (depth === 0) return;

  for (let i = 0; i < depth; i++) {
    updateElement(
      currentChildNodes,
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

function isEventProp(prop) {
  return prop.startsWith("on") && prop.length > 2;
}

function isClassProp(prop) {
  return prop === "class" || prop === "className";
}

function normalizeEventNape(prop) {
  return prop.toLowerCase().slice(2);
}
