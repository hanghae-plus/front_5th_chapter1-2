import { isEmpty, isPrimitive, isFunctionComponent } from "./utils.js";

export function createElement(vNode) {
  if (isFunctionComponent(vNode)) return handleFunctionComponent();

  let element;
  if (isEmpty(vNode)) element = handleEmpty();
  else if (Array.isArray(vNode)) element = handleArray(vNode);
  else if (isPrimitive(vNode)) element = handlePrimitive(vNode);
  else element = handleElement(vNode);

  return element;
}

function handleEmpty() {
  return document.createTextNode("");
}

function handleFunctionComponent() {
  throw new Error("createElement: 함수형 컴포넌트는 지원되지 않습니다.");
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
    $el.setAttribute(attrName, props[key]);
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
