import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 1️⃣ vNode가 비어있는 경우 빈 텍스트 노드 반환
  if (
    vNode == null ||
    typeof vNode === "boolean" ||
    typeof vNode === "undefined"
  ) {
    return document.createTextNode("");
  }

  // 2️⃣ 문자열 또는 숫자인 경우 텍스트 노드 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 3️⃣ 배열인 경우 DocumentFragment 사용 (가상 DOM 트리 병합)
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }

  // 4️⃣ 객체 형태인 경우 DOM 요소 생성
  if (typeof vNode === "object" && vNode.type) {
    const $el = document.createElement(vNode.type);

    // ✅ 속성 업데이트 (이벤트 핸들러 포함)
    updateAttributes($el, vNode.props);

    // ✅ 자식 노드 추가
    if (vNode.children) {
      vNode.children.forEach((child) => $el.appendChild(createElement(child)));
    }

    return $el;
  }

  throw new Error("잘못된 VNode 타입입니다.");
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.keys(props).forEach((key) => {
    if (key === "className") {
      $el.setAttribute("class", props[key]);
    } else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase(); // ✅ 이벤트 타입 추출 (onClick → click)
      addEvent($el, eventType, props[key]);
    } else {
      $el.setAttribute(key, props[key]); // ✅ 일반 속성 설정
    }
  });
}
