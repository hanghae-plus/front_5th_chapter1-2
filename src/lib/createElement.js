import { addEvent } from "./eventManager";

/**
 * 1. vNode가 null, undefined, boolean : 빈 텍스트 노드 반환
 * 2. vNode가 문자열이나 숫자 : 텍스트 노드로 생성해 반환
 * 3. vNode가 배열 :
 *      - DocumentFragment를 생성
 *      - 각 자식에 대해 createElement를 재귀적으로 호출해서 추가
 *      - null이나 undefined 자식은 무시
 * 4. 함수형 컴포넌트 : 지원하지 않음(에러 던짐)
 * 5. 위 경우가 아니면 실제 DOM 요소를 생성
 *      - vNode.type에 해당하는 요소를 생성
 *      - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
 *      - vNode.children의 각 자식에 대해 createElement를 재귀적으로 호출해서 추가
 * @param {*} vNode 가상 노드
 * @returns 실제 노드
 */
export function createElement(vNode) {
  // null, undefined, boolean 처리
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열이나 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    const $el = document.createDocumentFragment();
    vNode.forEach((child) => {
      if (child != null) {
        // null이나 undefined가 아닌 경우만 처리
        $el.appendChild(createElement(child));
      }
    });
    return $el;
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    throw new Error("함수형 컴포넌트는 지원하지 않습니다.");
  }

  // 일반 HTML 요소 생성 로직
  const $el = document.createElement(vNode.type);

  // 속성 적용
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  // 자식 요소 추가
  if (vNode.children) {
    vNode.children.forEach((child) => {
      if (child != null) {
        // null이나 undefined가 아닌 경우만 처리
        $el.appendChild(createElement(child));
      }
    });
  }

  return $el;
}

/**
 * DOM 요소($el)의 속성(attributes)을 업데이트하는 함수
 * props 객체에 있는 속성들을 실제 DOM 요소에 적용
 * @param {*} $el 실제 노드
 * @param {*} props 속성
 */
function updateAttributes($el, props) {
  if (!props) return; // props가 없으면 종료

  Object.entries(props).forEach(([name, value]) => {
    // onClick, onChange 같은 이벤트 핸들러 처리
    if (name.startsWith("on") && typeof value === "function") {
      const eventType = name.toLowerCase().substring(2);
      addEvent($el, eventType, value);
    }
    // className 처리
    else if (name === "className") {
      $el.setAttribute("class", value);
    }
    // 일반 속성 처리
    else if (name !== "children" && name !== "key") {
      if (value === true) {
        $el.setAttribute(name, "");
      } else if (value !== false && value != null) {
        $el.setAttribute(name, value);
      }
    }
  });
}
