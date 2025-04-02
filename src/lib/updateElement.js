import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newPropsArr = originNewProps ? Object.entries(originNewProps) : [];
  const oldPropsArr = originOldProps ? Object.entries(originOldProps) : [];

  // 기존 노드의 속성을 순회, 비교하여 업데이트
  for (const [prop, value] of oldPropsArr) {
    let newPropValue = originNewProps[prop];

    // 1. 이벤트 속성인 경우 기존 이벤트를 제거하고 새로운 이벤트를 업데이트하기 위해 준비
    if (isEventProp(prop)) {
      removeEvent(target, replaceEventProp(prop), value);
      newPropValue = originNewProps[replaceEventProp(prop)];
    }

    // 2. 업데이트 될 속성이 없는 경우 기존 속성을 제거
    if (newPropValue === undefined) {
      target.removeAttribute(prop);
      continue;
    }

    // 3. 기존 속성과 업데이트 될 속성이 다를 경우 속성을 업데이트
    if (value !== newPropValue) {
      // 3-1. 클래스 속성일 경우 classList를 업데이트
      if (isClass(prop)) {
        target.classList = newPropValue;
        continue;
      }
      // 3-2. 이벤트 속성일 경우 새로운 이벤트를 추가
      if (isEventProp(prop)) {
        addEvent(target, replaceEventProp(prop), newPropValue);
        continue;
      }

      // 3-3. 일반 속성일 경우 setAttribute로 업데이트
      target.setAttribute(prop, newPropValue);
      continue;
    }

    // 4. 기존 속성과 새로운 속성이 동일한 경우 아무 작업도 하지 않음 (불필요한 업데이트 방지)
    if (value === originNewProps[prop]) {
      continue;
    }
  }

  // 기존 속성에 없는 새로운 속성이 추가된 경우
  for (const [prop, value] of newPropsArr) {
    if (oldPropsArr[prop] === undefined) {
      // 1. 이벤트 속성일 경우 이벤트 추가
      if (isEventProp(prop)) {
        addEvent(target, replaceEventProp(prop), value);
        return;
      }
      // 2. 클래스 속성일 경우 classList 업데이트
      if (isClass(prop)) {
        target.classList = value;
        continue;
      }
      // 3. 일반 속성 추가
      target.setAttribute(prop, value);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 기존 노드(oldNode) 가 없는 경우
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 2. 업데이트 될 노드(newNode)가 없는 경우
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 3. 텍스트 노드(문자열, 숫자)인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // 4. 태그 이름(type)이 다른 경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 5. 태그 이름(type)이 같은 경우
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 자식 요소 비교를 위해 maxLength 값을 구하여 모든 자식 요소를 update
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  if (maxLength === 0) {
    return;
  }

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

function isEventProp(prop) {
  return /^on[A-Z]/.test(prop);
}

function isClass(prop) {
  return prop === "class" || prop === "className";
}

function replaceEventProp(prop) {
  return prop.slice(2).toLowerCase();
}
