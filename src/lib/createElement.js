import { addEvent } from "./eventManager";
// import { normalizeVNode } from "./normalizeVNode";
//virtualDOM -> realDOM
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
  if (!props || typeof props !== "object") return; // undefined, null, boolean 값에 대한 방어

  Object.entries(props).forEach(([attr, val]) => {
    if (val == null || val === false) return; // null, undefined, false 건너뜀
    if (attr.startsWith("on") && typeof val === "function") {
      // 이벤트 속성 처리 onClick > click > 위임 방식으로 처리
      const eventType = attr.slice(2).toLowerCase();
      addEvent($el, eventType, val);
    } else if (attr === "className") {
      $el.setAttribute("class", val); // JSX > HTML 속성 변환
    } else {
      $el.setAttribute(attr, val);
    }
  });
}
