import { isEmpty } from "../utils";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }
  if (isEmpty(vNode)) {
    return document.createTextNode("");
  }
  // 배열이 들어올때 fragment 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((item) => {
      const $el = createElement(item);
      if ($el) {
        fragment.appendChild($el);
      }
    });
    return fragment;
  }

  const $el = document.createElement(vNode.type);
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }
  if (vNode.children) {
    if (Array.isArray(vNode.children)) {
      const children = vNode.children.map(createElement).flat();
      children.forEach((child) => {
        $el.appendChild(child);
      });
    }
  }
  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props)
    .filter(([key, value]) => key && value)
    .forEach(([key, value]) => {
      if (key === "className") {
        key = "class";
        return $el.setAttribute(key, value);
      }
      if (key.startsWith("on")) {
        // event의 type 에 맞게 key 수정해줌.
        addEvent($el, key.slice(2).toLowerCase(), value);
        return;
      }
      return $el.setAttribute(key, value);
    });
}
