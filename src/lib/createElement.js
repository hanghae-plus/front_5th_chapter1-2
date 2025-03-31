// import { addEvent } from "./eventManager";

import { isArray, isInvalidVNode, isValidVNode } from "../utils/typeCheck";

/**가상돔을 돔으로 변환하는 함수
 * 1. vNode가 null, undefined, boolean일 경우 빈 텍스트 노드 반환
 * 2. vNode가 문자열이나 숫자면이면 텍스트 노드를 생성하여 반환
 * 3. vNode가 배열이면 DocumentFrament를 생성하고 각 자식에 대해 createElement를 재귀호출하여 추가한다.
 * 위의 경우가 아니면 실제 DOM 요소를 생성한다.
 * -  vNode.type에 해당하는 요소를 생성
 * -  vNode.props의 속성들을 적용
 * -  vNOde.children의 각 자식에 대해 createElement를 재귀호출하여 추가* **/
export function createElement(vNode) {
  if (isInvalidVNode(vNode)) {
    return document.createTextNode("");
  }

  if (isValidVNode(vNode)) {
    return document.createTextNode(vNode.toString());
  }
  if (isArray(vNode)) {
    const fragment = new DocumentFragment();

    for (let node of vNode) {
      fragment.appendChild(createElement(node));
    }
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  Object.entries(vNode.props || {})
    .filter(([, value]) => value)
    .forEach(([attr, value]) => {
      updateAttributes($el, attr, value);
    });

  const children = vNode.children.map(createElement);

  children.forEach((child) => $el.appendChild(child));

  return $el;
}

const updateAttributes = ($el, attr, value) => {
  attr === "className"
    ? $el.setAttribute("class", value)
    : $el.setAttribute(attr, value);
};
