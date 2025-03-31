import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((node) => fragment.appendChild(createElement(node)));

    return fragment;
  }

  if (vNode.type) {
    const $el = document.createElement(vNode.type);

    if (vNode.props) {
      updateAttributes($el, vNode.props);
    }

    if (vNode.children) {
      vNode.children.forEach((node) => $el.appendChild(createElement(node)));
    }

    return $el;
  }
}

function updateAttributes($el, props) {
  for (const key in props) {
    if (key.startsWith("on")) {
      // 1. 이벤트 리스너
      const eventType = key.slice(2).toLowerCase();
      //   $el.addEventListener(eventType, props[key]);
      addEvent($el, eventType, props[key]);
    } else if (key === "className") {
      // 2. ClassName
      $el.className = props[key];
    } else {
      // 3. 일반 속성
      $el.setAttribute(key, props[key]);
    }
  }
} //createElement함수로 만든 속성에 요소를 적용?
