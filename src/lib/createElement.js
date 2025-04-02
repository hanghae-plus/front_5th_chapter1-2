import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode !== "object") {
    return document.createTextNode(String(vNode));
  }

  // 컴포넌트 함수 처리
  if (typeof vNode.type === "function") {
    throw new Error(
      "함수형 컴포넌트는 createElement로 직접 처리할 수 없습니다. normalizeVNode를 먼저 사용하세요",
    );
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childEl = createElement(child);
      fragment.appendChild(childEl);
    });
    return fragment;
  }

  // HTML 요소 생성
  const $el = document.createElement(vNode.type);

  // 속성 처리
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  // 자식 요소 처리
  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childEl = createElement(child);
      $el.appendChild(childEl);
    });
  }

  return $el;
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    /*
     * null 또는 undefined 값은 속성 제거
     * todo 이건 왜 제거하는거지??
     *
     * */
    //  TODO 이건 왜 제거하는거지??
    if (value === null || value === undefined) {
      $el.removeAttribute(key);
      return;
    }

    // 이벤트 핸들러 처리 (onClick, onSubmit, ...)
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, value);
      return;
    }

    // 스타일 객체 처리
    if (key === "style" && typeof value === "object") {
      Object.entries(value).forEach(([cssKey, cssValue]) => {
        $el.style[cssKey] = cssValue;
      });
      return;
    }

    // 클래스 이름 처리
    if (key === "className") {
      $el.className = value;
      return;
    }

    // Bool 속성 처리
    if (typeof value === "boolean") {
      if (value) {
        $el.setAttribute(key, "");

        /*
         * todo 이건 특정 DOM 속성은 setAttribute 외에도 직접 설정 필요 라는데 뭘 의미하는거지??
         * */
        if (key in $el) {
          $el[key] = true;
        }
      } else {
        $el.removeAttribute(key);
        if (key in $el) {
          $el[key] = false;
        }
      }
      return;
    }

    // 일반 속성 처리
    $el.setAttribute(key, value);

    // 특정 DOM 속성은 값을 직접 설정(input:value)
    if (key === "value" || key === "checked" || key === "selected") {
      $el[key] = value;
    }
  });
}
