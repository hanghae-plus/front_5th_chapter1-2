// import { addEvent } from "./eventManager";

/**
 * 1. vNode가 null, undefined, boolean일 경우, 빈 텍스트 노드를 반환합니다.
 * 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
 * 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해
 * createElement를 재귀 호출하여 추가합니다.
 * 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다.
 * @param {*} vNode
 */
export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }
  // string, number -> text node로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const $fragmenet = document.createDocumentFragment();
    vNode.map((v) => {
      const $el = document.createElement(v.type);

      $fragmenet.appendChild($el);
    });
    return $fragmenet;
  }

  if (typeof vNode.type === "function") {
    throw new Error(
      "컴포넌트를 createElement로 처리하려고 하면 오류가 발생한다",
    );
  }

  const $el = document.createElement(vNode.type);

  Object.entries(vNode.props || {})
    .filter(([, value]) => value)
    .forEach(([attr, value]) => $el.setAttribute(attr, value));

  const _children = vNode.children.map(createElement);
  _children.forEach((child) => $el.appendChild(child));

  return $el;
}

// function updateAttributes($el, props) {}
