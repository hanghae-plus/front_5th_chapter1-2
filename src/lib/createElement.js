import { addEvent } from "./eventManager";
const isValidateNode = (node) => {
  if (node === null || node === undefined || node === true || node === false) {
    return false;
  }
  return true;
};

export function createElement(vNode) {
  // 빈 문자열
  if (!isValidateNode(vNode)) {
    return document.createTextNode("");
  }

  // 단순 문자열과 숫자
  if (typeof vNode == "string" || typeof vNode == "number") {
    return document.createTextNode(vNode);
  }

  // 배열
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const el = createElement(child);
      fragment.appendChild(el);
    });
    return fragment;
  }

  // 오브젝트
  if (typeof vNode == "object") {
    const el = document.createElement(vNode.type);
    const props = vNode.props ? vNode.props : {};
    const children = vNode.children;

    // console.log("props?", vNode.props); // class를 이렇게 손수 포맷팅하는게 맞는것인가?
    if (props) {
      updateAttributes(el, props);
    }

    if (children && children.length) {
      children.forEach((child) => el.appendChild(createElement(child)));
    }

    return el;
  }
}
function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    // 1. function인 경우
    if (typeof value == "function" && key.startsWith("on")) {
      addEvent($el, key.replace("on", "").toLocaleLowerCase(), value); // 2차
    }
    // 2. 그 외
    else {
      const filteredKey = key === "className" ? "class" : key;
      $el.setAttribute(filteredKey, value);
    }
  });
}
