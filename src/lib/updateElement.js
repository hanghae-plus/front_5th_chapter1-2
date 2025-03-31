import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps = {}, originOldProps = {}) {
  if (originNewProps) {
    // 새로운 props를 순회하면서 변경 또는 추가
    Object.entries(originNewProps).forEach(([key, value]) => {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        if (originOldProps[key] !== value) {
          addEvent(target, eventType, value);
        }
      } else {
        const attrName = key === "className" ? "class" : key;

        if (originOldProps[key] !== value) {
          target.setAttribute(attrName, value);
        }
      }
    });
  }

  if (originOldProps) {
    // 삭제된 props 제거
    Object.keys(originOldProps).forEach((key) => {
      if (!originNewProps || !(key in originNewProps)) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          removeEvent(target, eventType, originOldProps[key]);
        } else {
          const attrName = key === "className" ? "class" : key;
          target.removeAttribute(attrName);
        }
      }
    });
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;

  const existingElement = parentElement.childNodes[index];

  // 새 노드만 있으면 추가
  if (newNode && !oldNode) {
    const newEl = createElement(newNode);
    parentElement.appendChild(newEl);
    return null;
  }

  // 기존 노드만 있으면 제거
  if (!newNode && oldNode) {
    parentElement.removeChild(existingElement);
    return null;
  }

  // 4. 텍스트 노드 비교
  if (typeof newNode === "string") {
    if (typeof oldNode === "string") {
      // 기존 노드가 TextNode일 때는 nodeValue만 수정
      const existingTextNode = parentElement.childNodes[index];
      if (String(newNode) !== String(oldNode)) {
        existingTextNode.nodeValue = String(newNode);
      }
    } else {
      // 기존이 TextNode가 아니면 교체
      const newTextNode = document.createTextNode(String(newNode));
      parentElement.replaceChild(newTextNode, parentElement.childNodes[index]);
    }

    return null;
  }

  // 타입이 다르면 교체
  if (newNode.type !== oldNode.type) {
    const newEl = createElement(newNode);
    parentElement.replaceChild(newEl, existingElement);
    return null;
  }

  // 타입이 같으면 → props & children 비교
  updateAttributes(existingElement, newNode.props, oldNode.props);

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(existingElement, newChildren[i], oldChildren[i], i);
  }
}
