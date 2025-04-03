import { addEvent } from "./eventManager";

export function createElement(vNode) {
  //테스트 케이스 1 (불리언, undefined, null 처리)
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return document.createTextNode("");
  }
  //테스트 케이스 2 (숫자, 스트링 처리)
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  //배열일때 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  }

  /**
   * 이전에 createElement를 넣는 방식을 확인해봐야할 거 같다.
   * 어떤형식으로 createElement에 들어가는 걸까?
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement 예제를 보니 div, span, p 등등
   * 현재는 type이 [Funtion: TestComponent]임
   * 함수일때 처리하기
   */

  if (typeof vNode.type === "function") {
    // 컴포넌트 정규화 후 결과 사용
    document.createElement(vNode.type);
  }
  // FuncitonComponent를 사용했을 때 InvalidCharaterError 발생
  const $el = document.createElement(vNode.type);

  // 속성 설정
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  // 자식 요소 처리
  if (vNode.children) {
    const childEl = createElement(vNode.children);
    if (childEl) $el.appendChild(childEl);
  }
  // }
  return $el;
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    //값이 falsy인 경우 처리 안함 (단, 0과 빈 문자열은 제외)
    if (value === false || value === null || value === undefined) return;

    //이벤트 핸들러 처리
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
