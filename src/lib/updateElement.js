import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  Object.keys(newProps).forEach((key) => {
    const newProp = newProps[key];
    const oldProp = oldProps[key];
    if (newProp !== oldProp) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        if (oldProp) {
          removeEvent(target, eventType, oldProp);
        }

        if (newProp) {
          addEvent(target, eventType, newProp);
        }
      } else if (key === "className") {
        target.className = newProp;
      } else {
        target.setAttribute(key, newProp);
      }
    }
  });

  Object.keys(oldProps).forEach((key) => {
    const oldProp = oldProps[key];
    if (!newProps[key]) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldProp);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
