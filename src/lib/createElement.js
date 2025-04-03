import { addEvent } from "./eventManager.js";

import {
  isEmpty,
  isPrimitive,
  isEventAttribute,
  isFunctionComponent,
  getAttributeName,
  getEventType,
} from "./utils.js";

export function createElement(vNode) {
  if (isFunctionComponent(vNode)) return handleFunctionComponent();

  if (isEmpty(vNode)) return handleEmpty();
  else if (Array.isArray(vNode)) return handleArray(vNode);
  else if (isPrimitive(vNode)) return handlePrimitive(vNode);
  else return handleElement(vNode);
}

function handleFunctionComponent() {
  throw new Error("createElement: 함수형 컴포넌트는 지원되지 않습니다.");
}

function handleEmpty() {
  return document.createTextNode("");
}

function handleArray(vNode) {
  const fragment = document.createDocumentFragment();
  for (const child of vNode) {
    fragment.appendChild(createElement(child));
  }
  return fragment;
}

function handlePrimitive(vNode) {
  return document.createTextNode(vNode);
}

function handleElement(vNode) {
  const { type, props, children } = vNode;
  const el = document.createElement(type);

  if (props) updateAttributes(el, props);
  if (children) appendChildren(el, children);

  return el;
}

function updateAttributes($el, props) {
  const propKeys = Object.keys(props);

  for (const key of propKeys) {
    const attrName = getAttributeName(key);

    if (isEventAttribute(attrName)) {
      const eventType = getEventType(attrName);
      if (eventType) addEvent($el, eventType, props[key]);
    } else {
      $el.setAttribute(attrName, props[key]);
    }
  }
}

function appendChildren($el, children) {
  if (Array.isArray(children)) {
    const fragment = document.createDocumentFragment();
    for (const child of children) {
      fragment.appendChild(createElement(child));
    }
    $el.appendChild(fragment);
  } else {
    $el.appendChild(createElement(children));
  }
}
