import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  const $el = document.createElement(vNode.type);
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((v) => {
      fragment.appendChild(createElement(v));
    });
    return fragment;
  }

  const children = vNode.children || [];
  children.forEach((v) => $el.appendChild(createElement(v)));

  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else if (key in $el) {
      $el[key] = value;
    } else if (key === "id") {
      $el.setAttribute(key, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else if (!(key in $el) && value !== null) {
      $el.setAttribute(key, value);
    }
  });
  return { $el, props }; // 함수일때에 반환하는 코드를 작성.  각각 테스트 코드에 맞는 코드를 작성하면됨.
}
