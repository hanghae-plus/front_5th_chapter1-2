// import { addEvent } from "./eventManager";
import {
  exceptedNormalizedType,
  getType,
  toStringType,
} from "./normalizeVNode.js";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  const vNodeType = getType(vNode);
  if (exceptedNormalizedType.includes(vNodeType)) {
    // 텍스트 노드 생성
    return document.createTextNode("");
  }

  if (toStringType.includes(vNodeType)) {
    // 텍스트 노드 생성
    return document.createTextNode(String(vNode));
  }

  if (vNodeType === "array") {
    const fragment = document.createDocumentFragment();
    vNode.forEach((v) => {
      if (!v) return;
      const newItem = createElement(v);
      if (newItem) fragment.appendChild(newItem);
    });
    return fragment;
  }

  if (vNode.type) {
    const el = document.createElement(vNode.type);
    if (vNode.props) {
      // class, id 같은 el props 값 세팅
      Object.entries(vNode.props).forEach(([key, value]) => {
        // el.setAttribute(key, value);
        if (key === "className") {
          el.setAttribute("class", value);
          return;
        }
        if (key.startsWith("on")) {
          // 이벤트 핸들러 onXXX 처리
          const eventName = key.toLowerCase().slice(2);
          addEvent(el, eventName, value);
          return;
        }

        el.setAttribute(key, value);
      });
    }

    // ?
    if (vNode.children) {
      vNode.children
        .filter((child) => child)
        .forEach((child) => {
          el.appendChild(createElement(child));
        });
    }
    return el;
  }
}
