import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

export function updateAttributes(target, originNewProps, originOldProps) {
  // null 체크 및 기본값 설정
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  for (const [name, value] of Object.entries(newProps)) {
    // 이전 속성과 다르면 업데이트
    if (value !== oldProps[name]) {
      // 이벤트 핸들러 처리
      if (name.startsWith("on") && typeof value === "function") {
        const eventType = name.slice(2).toLowerCase();

        // 기존 이벤트 핸들러가 있으면 제거
        if (typeof oldProps[name] === "function") {
          removeEvent(target, eventType, oldProps[name]);
        }

        // 새 이벤트 핸들러 추가
        addEvent(target, eventType, value);
        continue;
      }

      // className 특별 처리
      if (name === "className") {
        target.setAttribute("class", value);
        continue;
      }

      // 불리언 속성 처리
      if (typeof value === "boolean") {
        if (value) {
          target.setAttribute(name, "");
        } else {
          target.removeAttribute(name);
        }
        target[name] = value;
        continue;
      }

      // 일반 속성
      target.setAttribute(name, value);
    }
  }

  // 제거할 속성 처리
  for (const name in oldProps) {
    if (!(name in newProps)) {
      // 이벤트 핸들러 제거
      if (name.startsWith("on") && typeof oldProps[name] === "function") {
        const eventType = name.slice(2).toLowerCase();
        removeEvent(target, eventType, oldProps[name]);
        continue;
      }

      // 불리언 속성 제거
      if (typeof oldProps[name] === "boolean") {
        target[name] = false;
      }

      // 속성 제거
      target.removeAttribute(name === "className" ? "class" : name);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 노드가 모두 없는 경우
  if (!oldNode && !newNode) {
    return;
  }

  // 이전 노드만 있는 경우 (삭제)
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 이전 노드가 없고 새 노드만 있는 경우 (추가)
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 둘 다 문자열이거나 숫자인 경우
  if (
    (typeof oldNode === "string" || typeof oldNode === "number") &&
    (typeof newNode === "string" || typeof newNode === "number")
  ) {
    if (oldNode !== newNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // 노드 타입이 다른 경우 (교체)
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 속성 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  // 자식 노드 업데이트
  const maxLength = Math.max(oldNode.children.length, newNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
