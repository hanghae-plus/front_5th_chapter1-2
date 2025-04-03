import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

export function updateElement(parent, newNode, oldNode, index = 0) {
  // oldNode 만 있는 경우
  if (!newNode && oldNode) {
    // oldNode 를 parent 에서 제거
    return parent.removeChild(parent.childNodes[index]);
  }

  // newNode 만 있는 경우
  if (newNode && !oldNode) {
    // newNode 를 parent 에 추가
    return parent.appendChild(createElement(newNode));
  }

  // oldNode 와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) {
      return;
    }

    // oldNode 내용을 newNode 내용으로 교체
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index],
    );
  }

  // oldNode 와 newNode type 이 다를 경우
  if (newNode.type !== oldNode.type) {
    // oldNode 를 parent 에서 제거하고 해당 위치에 newNode 를 추가
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index],
    );
  }

  // oldNode 와 newNode 의 type 이 같을 경우
  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // newNode 와 oldNode 의 모든 자식 태그를 순회하며 반복
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

// newNode 와 oldNode 의 attribute 를 비교하여 변경된 부분만 반영
function updateAttributes(target, newProps, oldProps) {
  // 새로운 속성을 순회하며 이전 속성값과 새로운 속성값이 같으면 변경하지 않음
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === newProps[attr]) {
      continue;
    }

    // 이벤트 속성인 경우
    if (attr.startsWith("on")) {
      const eventName = attr.slice(2).toLowerCase();

      // 이전 이벤트 핸들러 제거
      if (oldProps[attr]) {
        removeEvent(target, eventName);
      }

      // 새로운 이벤트 핸들러 추가
      addEvent(target, eventName, value);

      continue;
    }

    // className 속성을 class 로 변환
    if (attr === "className") {
      target.setAttribute("class", value);

      continue;
    }

    // 값이 다르면 DOM 요소에 새로운 속성 설정
    target.setAttribute(attr, value);
  }

  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) {
      continue;
    }

    // 이벤트 속성인 경우
    if (attr.startsWith("on")) {
      const eventName = attr.slice(2).toLowerCase();

      removeEvent(target, eventName);

      continue;
    }

    // className 속성을 class 로 변환
    if (attr === "className") {
      target.removeAttribute("class");

      continue;
    }

    // 이전 속성을 순회하며 새로운 속성값이 없으면 제거
    target.removeAttribute(attr);
  }
}
