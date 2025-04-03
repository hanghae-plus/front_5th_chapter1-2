import { createElement } from "./createElement";
import { addEvent, removeEvent } from "./eventManager";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  //updateElement를 구현해서 하고 싶은것은 diff 알고리즘의 구현이다.
  // oldNode와 newNode를 비교해서 변경사항만 바꿔주는게 이번 updateElement의 핵심 목표이다.
  // 1. 노드가 없는 경우 처리
  // newNode가 없고 oldNode만 있는 경우 -> 요소 제거
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. oldNode가 없고 newNode만 있는 경우 -> 새 요소 추가
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 3. 둘 다 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      // 텍스트가 다른 경우에만 업데이트
      parentElement.childNodes[index].nodeValue = newNode;
    }
    return;
  }
  // 4. 타입이 다른 경우 처리
  if (oldNode.type !== newNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  //4. 같은 타입의 요소인 경우
  //4.1 속성 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  //4.2 자식 노드 처리
  const newChildren = newNode?.children || [];
  const oldChildren = oldNode?.children || [];

  // 배열로 변환 (단일 자식인 경우도 처리)
  const newChildrenArray = Array.isArray(newChildren)
    ? newChildren
    : [newChildren].filter(Boolean);
  const oldChildrenArray = Array.isArray(oldChildren)
    ? oldChildren
    : [oldChildren].filter(Boolean);

  const maxLength = Math.max(newChildren.length, oldChildren.length);

  // r각 자식 노드에 대해 재귀적으로 업데이트
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newChildrenArray[i],
      oldChildrenArray[i],
      i,
    );
  }
}

function updateAttributes(target, newProps, oldProps) {
  // 1. old에는 있지만 new에는 없는 속성들 제거
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      if (key.startsWith("on")) {
        // 이벤트 핸들러 제거
        const eventType = key.toLowerCase().substring(2);
        removeEvent(target, eventType, oldProps[key]);
      } else if (key === "className") {
        // className 제거
        target.removeAttribute("class");
      } else if (key === "style") {
        // style 제거
        target.removeAttribute("style");
      } else {
        // 일반 속성 제거
        target.removeAttribute(key);
      }
    }
  });

  // 2. new props 처리 (새로 추가되거나 변경된 속성)
  Object.entries(newProps).forEach(([key, newValue]) => {
    const oldValue = oldProps[key];

    // 값이 변경된 경우에만 처리
    if (newValue !== oldValue) {
      // 이벤트 핸들러
      if (key.startsWith("on")) {
        const eventType = key.toLowerCase().substring(2);
        if (oldValue) {
          removeEvent(target, eventType, oldValue);
        }
        if (newValue) {
          addEvent(target, eventType, newValue);
        }
      }
      // className 처리
      else if (key === "className") {
        if (newValue) {
          target.setAttribute("class", newValue);
        } else {
          target.removeAttribute("class");
        }
      } else {
        if (newValue != null && newValue !== false) {
          target.setAttribute(key, newValue);
        } else {
          target.removeAttribute(key);
        }
      }
    }
  });
}
