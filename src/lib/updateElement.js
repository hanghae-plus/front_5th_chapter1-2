import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

// 속성 업데이트
function updateAttributes(target, originNewProps, originOldProps) {
  // element의 이전 props, 새 props를 받아서
  // 이전 props에만 있던 attribute는 삭제, 새 props에 있는 attribute는 추가
  // 둘 다 같은 attribute가 있으면 새 props에 있는 attribute 값으로 업데이트

  // createElement.js의 updateAttributes() : element 새로 생성
  // updateElement.js의 updateAttributes() : 원래 있던 element의 props와 비교

  Object.entries(originNewProps).forEach(([key, value]) => {
    if (originOldProps[key] !== value) {
      if (key.indexOf("on") === 0) {
        // 이벤트 처리
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, value);
      } else if (key === "className") {
        // class 이름
        target.setAttribute("class", value);
      } else {
        // 일반 속성
        target.setAttribute(key, value);
      }
    }
  });

  // 삭제된 속성 제거
  Object.entries(originOldProps).forEach(([key, value]) => {
    if (!originNewProps[key]) {
      if (key.indexOf("on") === 0) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, value);
      } else if (key === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(key);
      }
    }
  });
}

// Diff 알고리즘 !!
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // parentElement: 실제 DOM의 부모 요소
  // newNode: 새로 생성된 가상 노드, oldNode: 이전에 렌더링된 가상 노드
  // index: 현재 처리 중인 자식 노드 위치

  const currentElement = parentElement.childNodes[index]; //현재 노드

  if (!newNode && oldNode) {
    return parentElement.removeChild(currentElement); // 1. parentNode.removeChild(childNode) 자식 노드 제거
  }

  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode)); // 2. parentNode.appendChild(newNode) 자식 노드 추가
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      currentElement.textContent = newNode; // 3. 텍스트 노드 업데이트
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(createElement(newNode), currentElement); // 4. parentNode.replacChild(newChild, oldChild) 자식 노드 교체
  }

  // 5. 같은 타입 노드 업데이트
  updateAttributes(currentElement, newNode.props || {}, oldNode.props || {}); // 속성 업데이트

  // 자식 노드 재귀 처리
  const maxLength = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(currentElement, newNode.children[i], oldNode.children[i], i);
  }
}
