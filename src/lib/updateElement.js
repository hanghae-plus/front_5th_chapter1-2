import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { isFalsy, isPrimitive } from "../utils/typeCheck.js";

/**
 * 가상 DOM 노드를 실제 DOM에 업데이트하는 함수
 * @param {HTMLElement} $parent - 업데이트할 DOM 요소의 부모 노드. DOM API는 부모 노드를 통해서만 자식 요소를 수정할 수 있기 때문에 필요
 * @param {Object|string} newNode - 새로운 가상 DOM 노드
 *   @param {string} newNode.type - 노드의 타입
 *   @param {Object} newNode.props - 노드의 속성들
 *   @param {Array} newNode.children - 자식 노드들의 배열
 * @param {Object|string} oldNode - 이전 가상 DOM 노드 (구조는 newNode와 동일)
 * @param {number} [index=0] - 현재 노드의 인덱스
 */
export function updateElement($parent, newNode, oldNode, index = 0) {
  if (!$parent) return;
  if (!newNode && !oldNode) return;

  // 1. 노드가 삭제된 경우
  if (!newNode && oldNode) {
    return $parent.removeChild($parent.childNodes[index]);
  }

  // 2. 노드가 추가된 경우
  if (newNode && !oldNode) {
    return $parent.appendChild(createElement(newNode));
  }

  // 3. 텍스트만 변경된 경우
  if (typeof newNode === "string" || typeof oldNode === "string") {
    if (newNode !== oldNode) {
      const newTextNode = document.createTextNode(newNode);
      if ($parent.childNodes[index]) {
        $parent.replaceChild(newTextNode, $parent.childNodes[index]);
      } else {
        $parent.appendChild(newTextNode);
      }
    }
    return;
  }

  // 4. 요소 타입이 변경된 경우
  if (newNode.type !== oldNode.type) {
    const newEl = createElement(newNode);
    if ($parent.childNodes[index]) {
      $parent.replaceChild(newEl, $parent.childNodes[index]);
    } else {
      $parent.appendChild(newEl);
    }
    return;
  }

  // 5. 속성이 변경된 경우
  const targetEl = $parent.childNodes[index];
  if (targetEl) {
    updateAttributes(targetEl, newNode.props || {}, oldNode.props || {});
  }

  // 자식 노드 업데이트 ( 위 내용 반복 )
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const nodeMaxLength = Math.max(newChildren.length, oldChildren.length); // 더 긴놈으로 재귀 돌리기 위함

  [...Array(nodeMaxLength)].forEach((_, i) => {
    updateElement(
      $parent.childNodes[index],
      newNode?.children?.[i],
      oldNode?.children?.[i],
      i,
    );
  });
}

/**
 * 속성이 변경되었을 때
 * @param {HTMLElement} targetEl - 속성을 변경할 요소
 * @param {Object} newProps - 변경된 속성
 * @param {Object} oldProps - 변경되기 전 속성
 */
function updateAttributes(targetEl, newProps = {}, oldProps = {}) {
  /**
   * 이벤트 핸들러 처리 함수 - 이벤트 핸들러 제거 및 추가
   * @param {string} key - 이벤트 핸들러 키
   * @param {string|function} value - 이벤트 핸들러 값
   * @param {boolean} isRemove - 이벤트 핸들러 제거 여부
   * @returns {boolean} - 이벤트 핸들러 처리 여부
   */
  const handleEvent = (key, value, isRemove = false) => {
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().slice(2);
      if (isRemove) {
        removeEvent(targetEl, eventType, value);
      } else {
        removeEvent(targetEl, eventType, oldProps[key]); // 이전 이벤트 제거
        addEvent(targetEl, eventType, value);
      }
      return true;
    }
    return false;
  };

  /**
   * 일반 속성 처리 함수
   * @param {string} key - 속성 키
   * @param {string|function} value - 속성 값
   * @param {boolean} isRemove - 속성 제거 여부
   * @returns {boolean} - 속성 처리 여부
   */
  const handleAttribute = (key, value, isRemove = false) => {
    if (key === "className") {
      if (isRemove) {
        targetEl.removeAttribute("class");
      } else {
        targetEl.setAttribute("class", value);
      }
      return true;
    }

    // falsy 값이거나 primitive가 아닌 경우 처리 제외
    if (isFalsy(value) || !isPrimitive(value)) return true;

    if (isRemove) {
      targetEl.removeAttribute(key);
    } else {
      targetEl.setAttribute(key, value);
    }
    return true;
  };

  // 1. 이전 속성 중 제거할 것들 처리
  Object.entries(oldProps).forEach(([key, value]) => {
    if (key in newProps) return;
    handleEvent(key, value, true) || handleAttribute(key, value, true);
  });

  // 2. 새로운 속성 추가/업데이트
  Object.entries(newProps).forEach(([key, value]) => {
    if (oldProps[key] === value) return;
    handleEvent(key, value) || handleAttribute(key, value);
  });
}
