import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // DocumentFragment를 사용해 여러 요소를 한 번에 조작한 후, 한 번에 DOM 트리에 추가하면 재렌더링 성능이 크게 향상됨
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((v) => {
      fragment.appendChild(createElement(v));
    });

    return fragment;
  }

  if (typeof vNode === "boolean" || vNode == null) {
    return document.createTextNode("");
  }

  if (typeof vNode !== "object") {
    return document.createTextNode(vNode);
  }

  // 커스텀 컴포넌트 오류 처리
  if (typeof vNode.type === "function") {
    throw new Error("컴포넌트를 createElement로 생성할 수 없습니다.");
  }

  // 정규화 되어서 들어왔을 때 처리
  const $el = document.createElement(vNode.type);

  // vNode.props 있으면 attributes 추가
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  if (vNode.children) {
    if (Array.isArray(vNode.children)) {
      const children = vNode.children.map(createElement);

      children.forEach((child) => $el.appendChild(child));
    } else {
      $el.appendChild(createElement(vNode.children));
    }
  }

  return $el;
}

function updateAttributes($el, props = {}) {
  // props: { className: "", id: "" } ....
  Object.entries(props).forEach(([key, value]) => {
    // 이벤트 처리
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, value);
      return;
    }

    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }

    if (value === true) {
      $el.setAttribute(key, "");
    } else if (value !== false && value !== null && value !== undefined) {
      $el.setAttribute(key, value);
    }
  });
}
