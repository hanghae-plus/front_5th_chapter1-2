import { updateAttributes } from "../utils";

export function createElement(vNode) {
  // 엘리먼트 제외 / 텍스트 엘리먼트 처리
  const is = (type) => typeof vNode === type;
  if (vNode === null || vNode === undefined || is("boolean")) {
    return document.createTextNode("");
  } else if (is("string") || is("number")) {
    return document.createTextNode(String(vNode));
  } else if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((n) => {
      const $el = createElement(n);
      if ($el instanceof Node) $fragment.appendChild($el);
    });
    return $fragment;
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
