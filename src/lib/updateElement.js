import { cleanupElementEvents, removeEvent, addEvent } from "./eventManager";
import { createElement } from "./createElement";

/*
  1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  2. 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  3. 텍스트 노드 업데이트
  4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  5. 같은 타입의 노드 업데이트
      - 속성 업데이트
      - 자식 노드 재귀적 업데이트
      - 불필요한 자식 노드 제거
*/
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const oldElement = parentElement.childNodes[index];

  // Case 1
  if (!newNode && oldElement) {
    cleanupElementEvents(oldElement);
    parentElement.removeChild(oldElement);
    return null;
  }

  // Case 2
  if (!oldElement) {
    const newElement = createElement(newNode);
    if (parentElement.childNodes.length <= index) {
      parentElement.appendChild(newElement);
    } else {
      parentElement.insertBefore(newElement, parentElement.childNodes[index]);
    }
    return newElement;
  }

  // Case 3, newNode가 텍스트
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldElement.nodeType === 3) {
      if (oldElement.textContent !== `${newNode}`) {
        oldElement.textContent = newNode;
      }
      return oldElement;
    } else {
      const newTextNode = document.createTextNode(`${newNode}`);
      cleanupElementEvents(oldElement);
      parentElement.replaceChild(newTextNode, oldElement);
      return newTextNode;
    }
  }

  // Case 3, oldNode가 텍스트
  if (oldElement.nodeType === 3) {
    const newElement = createElement(newNode);
    parentElement.replaceChild(newElement, oldElement);
    return newElement;
  }

  // Case 4
  if (oldNode && oldNode.type !== newNode.type) {
    const newElement = createElement(newNode);
    cleanupElementEvents(oldElement);
    parentElement.replaceChild(newElement, oldElement);
    return newElement;
  }

  // Case 5

  diffAttributes(oldElement, newNode.props || {}, oldNode?.props || {});
  diffChildren(oldElement, newNode.children || [], oldNode?.children || []);

  return oldElement;
}

function diffAttributes(element, newProps, oldProps) {
  const allProps = new Set([
    ...Object.keys(newProps),
    ...Object.keys(oldProps),
  ]);
  allProps.delete("children");

  for (const name of allProps) {
    const newValue = newProps[name];
    const oldValue = oldProps[name];

    // 변경 없는 경우
    if (newValue === oldValue) continue;

    // 속성이 제거된 경우
    if (!(name in newProps)) {
      if (name.startsWith("on")) {
        const eventType = name.toLowerCase().substring(2);
        removeEvent(element, eventType, newValue);
      } else if (name === "className") {
        element.removeAttribute("class");
      } else if (name === "style") {
        element.style = "";
      } else {
        element.removeAttribute(name);
      }
      continue;
    }

    // 속성 업데이트
    if (name.startsWith("on")) {
      const eventType = name.toLowerCase().substring(2);
      if (oldValue) {
        removeEvent(element, eventType, oldValue);
      }
      if (newValue) {
        addEvent(element, eventType, newValue);
      }
    } else if (name === "style") {
      // 스타일 객체
      if (typeof newValue === "object") {
        Object.assign(element.style, newValue);
      } else {
        element.style.cssText = newValue;
      }
    } else if (name === "className") {
      element.setAttribute("class", newValue);
    } else if (name === "value") {
      // input, select 등 폼 요소 값
      element.value = newValue;
    } else if (typeof newValue === "boolean") {
      // 불리언 속성 (checked, disabled 등)
      if (newValue) {
        element.setAttribute(name, "");
      } else {
        element.removeAttribute(name);
      }
    } else {
      // 일반 속성
      element.setAttribute(name, newValue);
    }
  }
}

function diffChildren(parentElement, newChildren, oldChildren) {
  const newLength = newChildren.length;
  const oldLength = oldChildren.length;

  const maxLength = Math.max(newLength, oldLength);

  for (let i = 0; i < maxLength; i++) {
    const newChild = i < newLength ? newChildren[i] : null;
    const oldChild = i < oldLength ? oldChildren[i] : null;

    updateElement(parentElement, newChild, oldChild, i);
  }
}
