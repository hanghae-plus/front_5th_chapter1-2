import { addEvent, removeEvent } from "./eventManager"; // removeEvent가 없으면 추가 필요

// 공통 속성 처리 함수 (재사용성 강화)
function setAttributes($el, props) {
  if (!props || typeof props !== "object") return;

  for (const [key, value] of Object.entries(props)) {
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else {
      $el.setAttribute(key, value);
    }
  }
}

export function createElement(vNode) {
  // 디버깅 로그 추가
  console.log("createElement - vNode:", vNode);

  // 텍스트 노드 처리
  if (vNode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vNode.nodeValue);
  }

  // 요소 생성
  const el = document.createElement(vNode.type);

  // 속성 설정
  setAttributes(el, vNode.props || {});

  // 자식 노드 추가
  for (const child of vNode.children || []) {
    el.appendChild(createElement(child));
  }

  return el;
}

function updateAttributes($el, newProps, oldProps = {}) {
  if (!newProps || typeof newProps !== "object") return;

  // 새 속성 적용
  for (const [key, value] of Object.entries(newProps)) {
    if (oldProps[key] === value) continue; // 변경 없으면 스킵
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      if (oldProps[key]) {
        removeEvent($el, eventType, oldProps[key]); // 기존 이벤트 제거
      }
      addEvent($el, eventType, value);
    } else {
      $el.setAttribute(key, value);
    }
  }

  // 제거된 속성 처리
  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) {
      if (key === "className") {
        $el.removeAttribute("class");
      } else if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent($el, eventType, oldProps[key]);
      } else {
        $el.removeAttribute(key);
      }
    }
  }
}

// updateAttributes를 외부에서 사용할 수 있도록 내보내기 (선택적)
export { updateAttributes };
