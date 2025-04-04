import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 이전 props중에 있던 것과 새로운 props를 비교했을 때 key는 같지만 value가 달라진 것은 새로운 value로 변경
  // 이전 props에 없던 key가 새로운 props에 있는 것은 새롭게 key와 value 추가
  Object.entries(originNewProps).map(([key, value]) => {
    if (originOldProps[key] !== value) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, value);
      } else if (key === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(key, value);
      }
    }
  });

  // 이전 Props에 있는 key지만 새로운 props에 없는 key면은 제거
  Object.entries(originOldProps).map(([key, value]) => {
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, value);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 이전 노드에는 있으나 새로운 노드에는 없는 요소 제거
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 이전 노드에 없고 새로운 노드에 있는 요소 추가
  if (!oldNode && newNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 이전 노드와 새로운 노드가 문자열 타입인 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      return parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    }
  }

  // 이전 노드와 새로운 노드의 타입이 다른 경우 새로운 요소 생성 후 이전 요소와 교체
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    return parentElement.replaceChild(
      newElement,
      parentElement.childNodes[index],
    );
  }

  // 이전 노드와 새로운 노드의 타입은 같고 속성이 다른 경우 새로운 속성으로 교체
  if (newNode.type === oldNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props ?? {},
      oldNode.props ?? {},
    );
  }

  // 이전 노드의 자식 요소들과 새로운 노드의 자식 요소들도 위의 과정을 전부 수행
  const newChild = newNode.children || [];
  const oldChild = oldNode.children || [];

  const maxLength = Math.max(newChild.length, oldChild.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(parentElement.childNodes[index], newChild[i], oldChild[i], i);
  }
}
