import { isCheckStartOn, normalizeEventName } from "../utils/eventUtils";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // 컴포넌트 함수 처리
  if (typeof vNode.type === "function") {
    throw new Error("normalizeVNode를 먼저 사용하세요");
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  }
  // HTML 요소 생성
  const el = document.createElement(vNode.type);
  vNode.children.map(createElement).forEach((child) => el.appendChild(child));

  updateAttributes(el, vNode.props);
  return el;
}

function updateAttributes($el, props) {
  Object.entries(props || {}).forEach(([key, value]) => {
    if (isCheckStartOn(key)) {
      addEvent($el, normalizeEventName(key), value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
