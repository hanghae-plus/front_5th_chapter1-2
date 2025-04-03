import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (let [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === originNewProps[attr]) continue;

    if (attr.startsWith("on") && typeof originNewProps[attr] === "function") {
      // onClick -> click on이름 제거
      const eventType = attr.slice(2).toLowerCase();

      // onEvent가 먼저 등록되어있으면 제거
      if (typeof originOldProps[attr] === "function") {
        removeEvent(target, eventType, originOldProps[attr]);
      }

      addEvent(target, eventType, originNewProps[attr]);
      continue;
    }

    if (attr === "className") {
      attr = attr.replace("className", "class");
    }

    target.setAttribute(attr, value);
  }

  for (const attr of Object.keys(originOldProps)) {
    // old노드에서 새노드랑 비교해서 undefined가 아니면 아직 필요한 요소이므로 계속 불필요한 요소 찾기
    if (originNewProps[attr] !== undefined) continue;

    // 불필요한 요소 정리
    if (attr.startsWith("on")) {
      // onClick -> click on이름 제거
      const eventType = attr.slice(2).toLowerCase();
      removeEvent(target, eventType, originOldProps[attr]);
    }

    target.removeAttribute(attr);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // type , props, children 순으로 비교하고, 필요한 부분 업데이트? 하면 된다.

  // 1. oldNode만 있는 경우: node제거
  // 재귀로 돌면서 확인
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. newNode만 있는 경우
  // 재귀로 돌면서 확인
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
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }
  // 5. 두 노드가 같은 타입의 객체인 경우: 속성 업데이트 및 자식 비교
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(
    newNode.children ? newNode.children.length : 0,
    oldNode.children ? oldNode.children.length : 0,
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
