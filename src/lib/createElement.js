// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 빈 문자열
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
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

    if (props && props.length) {
      props.forEach((prop) => el.setAttribute(prop.key, prop.value));
    }

    if (children && children.length) {
      children.forEach((child) => el.appendChild(createElement(child)));
    }

    return el;
  }
}
// function updateAttributes($el, props) {}
