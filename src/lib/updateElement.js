import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = { ...originNewProps };
  const oldProps = { ...originOldProps };

  // 이전 이벤트 핸들러 제거
  Object.keys(oldProps).forEach((propName) => {
    if (
      propName.startsWith("on") &&
      (!newProps[propName] || newProps[propName] !== oldProps[propName])
    ) {
      const eventType = propName.toLowerCase().substring(2);
      removeEvent(target, eventType, oldProps[propName]);
    }
  });

  // 새로운 속성 추가 및 변경
  Object.keys(newProps).forEach((propName) => {
    if (propName.startsWith("on")) {
      const eventType = propName.toLowerCase().substring(2);
      addEvent(target, eventType, newProps[propName]);
    } else if (propName === "className") {
      target.setAttribute("class", newProps[propName]);
    } else {
      target.setAttribute(propName, newProps[propName]);
    }
  });

  // 삭제된 속성 제거
  Object.keys(oldProps).forEach((propName) => {
    if (!(propName in newProps)) {
      target.removeAttribute(propName);
    }
  });
}

// Diff 알고리즘: 가상 DOM과 실제 DOM의 차이를 최소한의 DOM 조작으로 반영
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const existingElement = parentElement.childNodes[index];

  // 1️⃣ 새로운 노드 추가
  if (!oldNode) {
    const newElement = createElement(newNode);
    parentElement.appendChild(newElement);
    return;
  }

  // 2️⃣ 노드 제거
  if (!newNode) {
    parentElement.removeChild(existingElement);
    return;
  }

  // 3️⃣ 타입이 다른 경우 전체 교체
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    parentElement.replaceChild(newElement, existingElement);
    return;
  }

  // 4️⃣ 텍스트 노드 업데이트
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (newNode !== oldNode) {
      existingElement.textContent = newNode;
    }
    return;
  }

  // 5️⃣ 속성과 이벤트 업데이트
  updateAttributes(existingElement, newNode.props || {}, oldNode.props || {});

  // 6️⃣ 자식 노드 재귀적 업데이트 (DFS 방식)
  const newLength = newNode.children?.length || 0;
  const oldLength = oldNode.children?.length || 0;

  for (let i = 0; i < Math.max(newLength, oldLength); i++) {
    updateElement(
      existingElement,
      newNode.children?.[i],
      oldNode.children?.[i],
      i,
    );
  }
}
