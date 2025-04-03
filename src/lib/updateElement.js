import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  //변경사항 반영
  for (let [key, value] of Object.entries(originNewProps)) {
    if (originOldProps[key] === originNewProps[key]) {
      continue;
    }

    if (key.startsWith("on") && typeof originNewProps[key] === "function") {
      const eventType = key.slice(2).toLowerCase();

      if (typeof originOldProps[key] === "function") {
        removeEvent(target, eventType, originOldProps[key]);
      }

      addEvent(target, eventType, originNewProps[key]);
      continue;
    }

    //className -> classname
    const attrKey = key === "className" ? "class" : key;
    target.setAttribute(attrKey, value);
  }

  //삭제된 props 제거
  for (const key of Object.keys(originOldProps)) {
    if (originNewProps[key] !== undefined) {
      continue;
    }

    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      removeEvent(target, eventType, originOldProps[key]);
    }
    target.removeAttribute(key);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  //1. newNode가 없고 oldNode가 있는 경우
  //노드 제거
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  //2. newNode가 있고 oldNode가 없는 경우
  //새 노드 추가
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  //3. 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) {
      return;
    }

    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  //4. newNode와 oldNode의 타입이 다른 경우
  //노드 교체
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  //같은 타입의 노드 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode?.props || {},
    oldNode?.props || {},
  );

  //newNode와 oldNode를 전부 순회하며 update
  const maxLength = Math.max(
    newNode.children?.length,
    oldNode.children?.length,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode?.children[i],
      oldNode?.children[i],
      i,
    );
  }
}
