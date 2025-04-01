import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) {
    return;
  }

  const newProps = { ...originNewProps };
  const oldProps = { ...originOldProps };

  const props = { ...newProps, ...oldProps };

  // 새로운 속성들을 추가하거나 기존 속성을 업데이트
  Object.keys(props).forEach((key) => {
    const newValue = newProps[key];
    const oldValue = oldProps[key];

    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().slice(2);

      if (!newValue && oldValue) {
        removeEvent(target, eventType);
      } else if (newValue && !oldValue) {
        addEvent(target, eventType, newValue);
      } else if (newValue && oldValue && newValue !== oldValue) {
        removeEvent(target, eventType);
        addEvent(target, eventType, newValue);
      }
      return;
    }

    if (newValue === oldValue) {
      return;
    }

    if (newValue == null || newValue === false) {
      target.removeAttribute(key === "className" ? "class" : key);
    } else {
      target.setAttribute(key === "className" ? "class" : key, newValue);
    }
  });
}

// 기존 DOM 업데이트
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
  } else if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
  } else if (newNode && oldNode && newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  } else if (newNode.type === "string" && oldNode.type === "string") {
    if (newNode === oldNode) {
      return;
    }
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  } else if (newNode && oldNode && newNode.type === oldNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props || {},
      oldNode.props || {},
    );

    // 자식 요소들이 배열이면 각각 재귀적으로 업데이트
    const maxLength = Math.max(
      newNode.children?.length || 0,
      oldNode.children?.length || 0,
    );

    for (let i = 0; i < maxLength; i++) {
      updateElement(
        parentElement.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i,
      );
    }
  }
}
