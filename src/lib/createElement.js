// import { addEvent } from "./eventManager";
import { updateAttributes } from "./updateElement";

export function createElement(vNode) {
  // null, undefined, boolean 타입 빈 텍스트 노드로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열이나 숫자 타입 텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 타입 DocumentFragment 변환
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    // 각 항목을 fragment에 추가
    for (const child of vNode) {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    }

    return fragment;
  }

  // 가상 노드의 type이 함수인 경우 에러 발생
  if (typeof vNode.type === "function") {
    throw new Error(
      "컴포넌트를 createElement로 직접 처리할 수 없습니다. normalizeVNode를 먼저 사용하세요.",
    );
  }

  // 실제 DOM 요소 생성
  const element = document.createElement(vNode.type);

  // 속성 설정
  if (vNode.props) {
    updateAttributes(element, vNode.props, null);
  }

  // 자식 요소 처리
  if (vNode.children) {
    for (const child of vNode.children) {
      const childElement = createElement(child);
      element.appendChild(childElement);
    }
  }

  return element;
}
