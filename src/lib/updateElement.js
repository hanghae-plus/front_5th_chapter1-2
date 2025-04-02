import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * DOM 요소의 속성과 이벤트를 업데이트합니다.
 * @param {HTMLElement} target - 업데이트할 DOM 요소
 * @param {Object} originNewProps - 새 속성 객체
 * @param {Object} originOldProps - 이전 속성 객체
 */
function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  // 제거된 속성 처리
  Object.keys(oldProps).forEach((key) => {
    // children과 key는 여기서 처리하지 않음
    if (key === "children" || key === "key") return;

    // 이벤트 핸들러 처리 (onClick, onMouseOver 등)
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      const eventType = key.toLowerCase().substring(2);

      // 새 props에 없거나 다른 핸들러인 경우, 이전 핸들러 제거
      if (!newProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      } else if (newProps[key] !== oldProps[key]) {
        // 이전 핸들러와 새 핸들러가 다른 경우
        removeEvent(target, eventType, oldProps[key]);
        addEvent(target, eventType, newProps[key]);
      }

      // 이미 처리했으므로 다음 속성으로 넘어감
      return;
    }

    // 일반 속성 제거 (새 props에 없는 경우)
    if (!(key in newProps)) {
      if (key === "className") {
        target.removeAttribute("class");
      } else if (typeof oldProps[key] === "boolean") {
        target.removeAttribute(key);
        // DOM 프로퍼티도 업데이트
        if (key in target) {
          target[key] = false;
        }
      } else {
        target.removeAttribute(key);
        // DOM 프로퍼티도 초기화
        if (key in target) {
          target[key] = "";
        }
      }
    }
  });

  // 새로운 속성 또는 변경된 속성 처리
  Object.keys(newProps).forEach((key) => {
    // children과 key는 여기서 처리하지 않음
    if (key === "children" || key === "key") return;

    // 이벤트 핸들러 처리 (onClick, onMouseOver 등)
    if (key.startsWith("on") && typeof newProps[key] === "function") {
      const eventType = key.toLowerCase().substring(2);

      // 이전에 없던 새로운 이벤트 핸들러 추가
      if (!oldProps[key]) {
        addEvent(target, eventType, newProps[key]);
      }
      // 위에서 이미 핸들러가 다른 경우의 교체는 처리했음
      return;
    }

    // 일반 속성 처리 (이전 props와 다른 경우)
    if (newProps[key] !== oldProps[key]) {
      if (key === "className") {
        target.setAttribute("class", newProps[key]);
      } else if (typeof newProps[key] === "boolean") {
        if (newProps[key]) {
          target.setAttribute(key, "");
          // DOM 프로퍼티도 업데이트
          if (key in target) {
            target[key] = true;
          }
        } else {
          target.removeAttribute(key);
          // DOM 프로퍼티도 업데이트
          if (key in target) {
            target[key] = false;
          }
        }
      } else {
        target.setAttribute(key, newProps[key]);
        // DOM 프로퍼티도 업데이트
        if (key in target) {
          target[key] = newProps[key];
        }
      }
    }
  });
}

/**
 * DOM 요소를 업데이트합니다.
 * @param {HTMLElement} parentElement - 부모 요소
 * @param {Object|string} newNode - 새 가상 DOM 노드
 * @param {Object|string} oldNode - 이전 가상 DOM 노드
 * @param {number} index - 자식 인덱스
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 노드에 접근하기 전에 인덱스가 유효한지 확인
  const childNode = parentElement.childNodes[index];

  // 1. 새 노드가 없는 경우 (요소 제거)
  if (!newNode) {
    // 이전 노드가 있었다면 DOM에서 제거
    if (childNode) {
      parentElement.removeChild(childNode);
    }
    return;
  }

  // 2. 이전 노드가 없는 경우 (새 요소 추가)
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 3. 텍스트 노드 처리
  if (
    typeof newNode === "string" ||
    typeof newNode === "number" ||
    typeof oldNode === "string" ||
    typeof oldNode === "number"
  ) {
    // 둘 다 텍스트 노드이고 내용이 다른 경우
    if (
      (typeof newNode === "string" || typeof newNode === "number") &&
      (typeof oldNode === "string" || typeof oldNode === "number") &&
      String(newNode) !== String(oldNode)
    ) {
      if (childNode) {
        childNode.nodeValue = String(newNode);
      } else {
        parentElement.appendChild(document.createTextNode(String(newNode)));
      }
    }
    // 타입이 다른 경우 요소 교체
    else if (typeof newNode !== typeof oldNode) {
      const newElement = createElement(newNode);
      if (childNode) {
        parentElement.replaceChild(newElement, childNode);
      } else {
        parentElement.appendChild(newElement);
      }
    }
    return;
  }

  // 4. 요소 타입이 다른 경우 (교체)
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    if (childNode) {
      parentElement.replaceChild(newElement, childNode);
    } else {
      parentElement.appendChild(newElement);
    }
    return;
  }

  // 5. 같은 타입의 요소 업데이트
  if (childNode) {
    updateAttributes(childNode, newNode.props, oldNode.props);

    // 6. 자식 요소 업데이트
    const newChildren = newNode.children || [];
    const oldChildren = oldNode.children || [];
    const maxLength = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLength; i++) {
      updateElement(
        childNode,
        i < newChildren.length ? newChildren[i] : null,
        i < oldChildren.length ? oldChildren[i] : null,
        i,
      );
    }
  }
}
