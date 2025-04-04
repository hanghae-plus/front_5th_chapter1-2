import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * 이벤트가 바뀐게 있을 경우, 업데이트
 * @param {*} target
 * @param {*} originNewProps - vNode.props className, id
 * @param {*} originOldProps - vNode.props
 */
function updateAttributes(target, originNewProps, originOldProps) {
  // 이벤트 핸들러 처리 attr : className  value : w-full
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (attr.startsWith("on")) {
      const eventType = attr.slice(2).toLowerCase();
      if (originOldProps[attr]) {
        removeEvent(target, eventType, originOldProps[attr]);
      }
      addEvent(target, eventType, value);
      continue;
    }
    const domAttr = attr === "className" ? "class" : attr;
    // 이전 속성값이 예전 속성값이랑 같으면 다음 for문으로
    if (originOldProps[attr] === originNewProps[attr]) continue;
    // 다르면 element에 이벤트 삽입
    target.setAttribute(domAttr, value);
  }

  // 제거된 이벤트 핸들러 정리
  for (const attr of Object.keys(originOldProps)) {
    if (attr.startsWith("on")) {
      const eventType = attr.slice(2).toLowerCase();
      if (originNewProps[attr] === undefined) {
        removeEvent(target, eventType, originOldProps[attr]);
      }
    }
    if (originNewProps[attr] !== undefined) continue;
    target.removeAttribute(attr);
  }
}

/**
 * Diff 알고리즘 사용. 이전 가상돔과 새 가상 돔을 비교하여 실제 Dom에 최소한면 변경
 * @param {*} parentElement - 업데이트할 DOM 요소의 부모 노드. DOM API는 부모 노드를 통해서만 자식 요소를 수정할 수 있기 때문에
 * @param {*} newNode - 새 가상 DOM 노드
 * @param {*} oldNode - 이전 가상 DOM 노드
 * @param {*} index  - 현재 노드의 인덱스
 * @returns
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 새 가상 DOM에 노드가 없지만 이전 가상 DOM에는 있는 경우
  if (!newNode && oldNode) {
    // 해당 위치의 자식 요소가 존재하는지 확인
    if (index < parentElement.childNodes.length) {
      // 제거
      parentElement.removeChild(parentElement.childNodes[index]);
    }
    return;
  }

  // 2. 노드가 추가된 경우
  if (newNode && !oldNode) {
    // 가상돔을 실제 Dom 요소로 생성하고 자식으로 추가
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 3. 노드 타입이 변경된 경우
  if (
    typeof newNode !== typeof oldNode ||
    (typeof newNode === "string" && newNode !== oldNode) ||
    (newNode && oldNode && newNode.type !== oldNode.type)
  ) {
    // 해당 위치의 DOM 요소가 존재하는지 확인
    if (index < parentElement.childNodes.length) {
      // 기존 노드를 새 노드로 교체
      parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    } else {
      // 해당 위치에 DOM 요소가 없으면 새로 추가
      parentElement.appendChild(createElement(newNode));
    }
    return;
  }

  // 4. 같은 노드 타입이면 속성 업데이트 (객체인 경우)
  if (newNode && oldNode && typeof newNode !== "string") {
    // 해당 위치의 DOM 요소가 존재하는지 확인
    if (index >= parentElement.childNodes.length) {
      // DOM 요소가, vDOM보다 적으면 새로 생성
      parentElement.appendChild(createElement(newNode));
      return;
    }

    // 현재 DOM 요소
    const element = parentElement.childNodes[index];

    // 속성 업데이트
    updateAttributes(element, newNode.props || {}, oldNode.props || {});

    // 자식 요소 업데이트
    const newChildren = newNode.children || [];
    const oldChildren = oldNode.children || [];
    const maxLength = Math.max(newChildren.length, oldChildren.length);

    // 자식 요소들을 재귀적으로 업데이트
    for (let i = 0; i < maxLength; i++) {
      updateElement(element, newChildren[i], oldChildren[i], i);
    }
  }
}
