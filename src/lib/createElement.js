import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    vNode === undefined ||
    vNode == null ||
    vNode === false ||
    vNode === true
  ) {
    return document.createTextNode("");
  } else if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 입력 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((node) => {
      let el = document.createElement(node.type);
      if (node.props) el = addProps(el, props);
      fragment.appendChild(el);
    });

    return fragment;
  }

  // 정규화하지 않았을 경우 에러처리
  if (typeof vNode.type === "function") {
    throw new Error();
  }

  let el = document.createElement(vNode.type);
  if (vNode.props) updateAttributes(el, vNode.props);

  // 텍스트 노드 합치기
  const normalizedChildren = [];
  let buffer = "";
  for (const child of vNode.children) {
    if (typeof child === "string" || typeof child === "number") {
      buffer += child;
    } else {
      if (buffer) {
        normalizedChildren.push(buffer);
        buffer = "";
      }
      normalizedChildren.push(child);
    }
  }
  if (buffer) normalizedChildren.push(buffer);

  normalizedChildren.forEach((child) => el.appendChild(createElement(child)));
  return el;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();
      addEvent($el, event, value);
    } else if (key === "className") {
      value.split(" ").forEach((val) => $el.classList.add(val));
    } else if (key === "style" && typeof value === "object") {
      Object.assign($el.style, value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
