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

  if (vNodeType === "object") {
    const el = document.createElement(vNode.type);
    if (vNode.props) {
      // class, id 같은 el props 값 세팅
      Object.entries(vNode.props).forEach(([key, value]) => {
        // el.setAttribute(key, value);
        if (key === "className") {
          // el.classList.add(value);
          el.className = value;
        } else if (key.startsWith("on")) {
          // 이벤트 핸들러 onXXX 처리
          const eventName = key.slice(2).toLowerCase();
          addEvent(el, eventName, value);
        } else {
          el.setAttribute(key, value);
        }
        // // else if (key === "style" && typeof value === "object") {
        // //   // 스타일 객체일 경우: { color: 'red' } -> el.style.color = 'red';
        // //   for (const [styleKey, styleValue] of Object.entries(value)) {
        // //     el.style[styleKey] = styleValue;
        // //   }
        // // }
        // else {
        //   el.setAttribute(key, value);
        // }
      });
    }

    vNode.children
      .filter((child) => child)
      .forEach((child) => {
        el.appendChild(createElement(child));
      });
    return el;
  }

  if (vNodeType === "array") {
    const fragment = document.createDocumentFragment();
    vNode.forEach((v) => {
      const newItem = createElement(v);
      fragment.appendChild(newItem);
    });
    return fragment;
  }
}
