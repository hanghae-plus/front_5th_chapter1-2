// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // vNode가 null, boolean, undefined인 경우 빈 문자열 반환
  if (
    vNode == null ||
    typeof vNode === "boolean" ||
    typeof vNode === "undefined"
  ) {
    return document.createTextNode("");
  }

  // 문자열 또는 숫자인 경우 텍스트 노드로 변환
  if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(String(vNode));
  }

  // 배열인 경우 createDocumentFragment으로 변환
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((v) => {
      fragment.appendChild(createElement(v));
    });
    return fragment;
  }

  // 객체인 경우 요소 노드로 변환
  if (typeof vNode === "object" && vNode.type) {
    const $el = document.createElement(vNode.type);

    if (vNode.children) {
      vNode.children.forEach((child) => {
        $el.appendChild(createElement(child));
      });
    }

    // 속성 업데이트 추가
    updateAttributes($el, vNode.props);

    return $el;
  }

  if (typeof vNode.type === "function") {
    throw new Error("컴포넌트는 createElement에서 직접 처리할 수 없습니다.");
  }
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.keys(props).forEach((key) => {
    if (key === "className") {
      $el.setAttribute("class", props[key]); // className을 class로 변환
    } else {
      $el.setAttribute(key, props[key]);
    }
  });
}
