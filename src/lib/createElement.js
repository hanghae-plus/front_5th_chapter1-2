import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // null, undefined, boolean 값을 빈 텍스트 노드로 변환
  if (typeof vNode === "boolean" || vNode === undefined || vNode === null) {
    return document.createTextNode("");
  }

  // 문자열이나 숫자는 텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열일 경우 DocumentFragment로 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      if (child !== null && child !== undefined && child !== false) {
        const childElement = createElement(child);
        fragment.appendChild(childElement);
      }
    });
    return fragment;
  }

  // 함수형 컴포넌트는 처리할 수 없음
  if (typeof vNode.type === "function") {
    throw new Error("컴포넌트는 normalizeVNode로 먼저 정규화해야 합니다.");
  }

  // DOM 요소 생성
  const element = document.createElement(vNode.type);

  // 속성 처리
  if (vNode.props) {
    updateAttributes(element, vNode.props);
  }

  // 자식 요소 처리
  if (vNode.children && vNode.children.length > 0) {
    vNode.children.forEach((child) => {
      if (child !== null && child !== undefined && child !== false) {
        const childElement = createElement(child);
        element.appendChild(childElement);
      }
    });
  }

  return element;
}

function updateAttributes(element, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    // key와 같은 내부 속성 무시
    if (key === "key") return;

    // 이벤트 핸들러 처리 (onClick, onMouseOver 등)
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent(element, eventType, value);
      return;
    }

    // className은 class 속성으로 변환
    if (key === "className") {
      element.setAttribute("class", value);
      return;
    }

    // boolean 속성 처리 (disabled, checked 등)
    if (typeof value === "boolean") {
      if (value) {
        element.setAttribute(key, "");
        // 속성 값도 DOM 프로퍼티로 설정
        if (key in element) {
          element[key] = true;
        }
      } else {
        element.removeAttribute(key);
        // 속성 값도 DOM 프로퍼티로 설정
        if (key in element) {
          element[key] = false;
        }
      }
      return;
    }

    // 일반 속성 처리
    element.setAttribute(key, value);

    // 특정 속성은 DOM 프로퍼티로도 설정 (value, checked 등)
    if (key in element) {
      element[key] = value;
    }
  });
}
