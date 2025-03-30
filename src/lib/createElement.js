import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 엘리먼트 제외 / 텍스트 엘리먼트 처리
  const is = (type) => typeof vNode === type;
  if (vNode === null || vNode === undefined || is("boolean")) {
    return document.createTextNode("");
  } else if (is("string") || is("number")) {
    return document.createTextNode(String(vNode));
  } else if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((n) => {
      const el = createElement(n);
      if (el instanceof Node) fragment.appendChild(el);
    });
    return fragment;
  }
  // nomalize하지 않은 컴포넌트 처리
  if (typeof vNode.type === "function") throw new Error();

  if (typeof vNode.type !== "string") throw new Error();
  // type이 태그인 노드 처리
  const { props, children } = vNode;
  const $el = document.createElement(vNode.type);
  if (props) updateAttributes($el, props);
  if (children) children.forEach((c) => $el.appendChild(createElement(c)));
  return $el;
}

function updateAttributes($el, props) {
  const setAttributes = ([key, value]) => {
    // key 이름 매핑
    if (key === "className") key = "class";
    // 함수처리, on도 신경써야 할 지..
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    }
    // value가 객체인 경우.. 아직 미구현 ex: style={{ display: "none" }};
    else if (typeof value === "object")
      Object.entries(value).forEach(setAttributes);
    else $el.setAttribute(key, value);
  };
  Object.entries(props).forEach(setAttributes);
}
