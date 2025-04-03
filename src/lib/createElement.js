import { addEvent } from "./eventManager";

/**
 * vNode 객체를 실제 DOM 요소로 변환하는 함수
 */
export function createElement(vNode) {
  if (
    vNode === true ||
    vNode === false ||
    vNode === null ||
    vNode === undefined
  ) {
    return document.createTextNode("");
  }

  // vNode 객체가 문자열이거나 숫자인 경우 텍스트 노드 생성
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // vNode 객체가 배열인 경우 DocumentFragment 생성
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });

    return fragment;
  }

  // vNode 객체의 type 속성에 해당하는 실제 DOM 요소 생성
  // type: 요소의 종류 (ex. div, span, button 등)
  const $el = document.createElement(vNode.type);

  // props 객체를 [key, value] 쌍의 배열로 변환
  // forEach 로 각 속성을 DOM 요소에 설정
  Object.entries(vNode.props || {})
    .filter(([, value]) => value)
    .forEach(([attribute, value]) => {
      if (attribute === "className") {
        // className 속성을 class 속성으로 변환
        // React 에서는 className 을 사용하지만, 브라우저에서는 class 를 사용
        $el.setAttribute("class", value);

        // props를 처리할 때 attribute 가 "on"으로 시작하는지 확인
        // "on" 으로 시작하는 경우 이벤트 핸들러로 처리
        // 이벤트 이름은 "on" 을 제거하고 소문자로 변환
      } else if (attribute.startsWith("on")) {
        const eventName = attribute.slice(2).toLowerCase();

        addEvent($el, eventName, value);
      } else {
        $el.setAttribute(attribute, value);
      }
    });

  // 자식 노드를 재귀적으로 DOM 요소로 변환
  const children = vNode.children.map(createElement);

  // 변환된 자식 요소를 현재 요소에 추가
  children.forEach((child) => $el.appendChild(child));

  return $el;
}
