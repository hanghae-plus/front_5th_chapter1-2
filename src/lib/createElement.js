import { addEvent } from "./eventManager.js";

import { isEmpty, isPrimitive, isFunctionComponent } from "./utils.js";

export function createElement(vNode) {
  if (isFunctionComponent(vNode)) return handleFunctionComponent();
  else if (isEmpty(vNode)) return handleEmpty();
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
    const attrName = key === "className" ? "class" : key;
    const isEventAttr = key.startsWith("on");
    if (isEventAttr) {
      const eventName = key.slice(2).toLowerCase();
      addEvent($el, eventName, props[key]);
    } else {
      $el.setAttribute(attrName, props[key]);
    }
  }
}

function appendChildren($el, children) {
  if (Array.isArray(children)) {
    for (const child of children) {
      $el.appendChild(createElement(child));
    }
  } else {
    $el.appendChild(createElement(children));
  }
}
