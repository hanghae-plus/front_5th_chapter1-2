import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const docFrag = document.createDocumentFragment();
    docFrag.append(...vNode.map(createElement));
    return docFrag;
  }

  const el = document.createElement(vNode.type);
  vNode.children.map(createElement).forEach((child) => el.appendChild(child));

  updateAttributes(el, vNode.props);
  return el;
}

function updateAttributes($el, props) {
  Object.entries(props || {}).map(([attr, value]) => {
    // 이벤트를 이벤트 관리 객체에 넣어주기
    if (attr?.startsWith("on")) {
      addEvent($el, attr.slice(2).toLowerCase(), props[attr]);
      return; // 이벤트의 경우, 아래 코드가 실행되지 않도록 return
    }

    // 테스트코드 통과를 위해 className이 아니라 class로 넣기
    if (attr === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(attr, value);
    }
  });
}
