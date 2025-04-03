// import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { addEvent, removeEvent } from "./eventManager.js";

/**
 * @param {HTMLElement} target
 * @param {Object} newProps
 * @param {Object} oldProps
 */
function updateAttributes(target, newProps, oldProps) {
  // 다른거 갈아끼우고 + 생긴거 추가하고
  Object.entries(newProps).map(([key, value]) => {
    if (oldProps[key] === value) return;

    if (key === "className") key = "class";

    if (key.startsWith("on")) {
      return addEvent(target, key.replace("on", "").toLowerCase(), value);
    }

    target.setAttribute(key, value);
  });

  // 없어진거 제거
  Object.keys(oldProps).map((key) => {
    if (newProps[key] !== undefined) return;

    if (key.startsWith("on")) {
      removeEvent(target, key.replace("on", "").toLowerCase(), oldProps[key]);
    }

    target.removeAttribute(key);
  });
}

/**
 * 가상 DOM 노드 타입 정의
 * @typedef {Object} VNode
 * @property {keyof HTMLElementTagNameMap|Function} type - 노드의 타입 ( HTML 태그명 or 컴포넌트 함수 )
 * @property {Object|null} props - 노드의 속성들
 * @property {Array<string|number|VNode>} children - 자식 노드들
 */

/**
 * 가상노드를 비교 후 실제 노드로 변환해서 업데이트하는 함수
 * @link https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Virtual-DOM/#_4-diff-%E1%84%8B%E1%85%A1%E1%86%AF%E1%84%80%E1%85%A9%E1%84%85%E1%85%B5%E1%84%8C%E1%85%B3%E1%86%B7-%E1%84%8C%E1%85%A5%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC
 *
 * @param {HTMLElement} parentElement 실제 Element
 * @param {VNode | string} newVNode 새로운 가상 노드
 * @param {VNode | string} oldVNode 기존 가상 노드
 * @param {number} index 노드의 깊이
 */
export function updateElement(parentElement, newVNode, oldVNode, index = 0) {
  // 1. 노드 제거 ( newVNode가 없고 oldVNode가 있는 경우 )
  if (!newVNode && oldVNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. 노드 추가 ( newVNode가 있고 oldVNode가 없는 경우 )
  if (newVNode && !oldVNode) {
    return parentElement.appendChild(createElement(newVNode));
  }

  // 3. 텍스트 노드 ( newVNode와 oldVNode가 모두 텍스트 노드인 경우 )
  if (typeof newVNode === "string" && typeof oldVNode === "string") {
    if (newVNode === oldVNode) return;

    return parentElement.replaceChild(
      createElement(newVNode),
      parentElement.childNodes[index],
    );
  }

  // 4. 노드 교체 ( newVNode와 oldVNode의 타입이 다른 경우 )
  if (newVNode.type !== oldVNode.type) {
    return parentElement.replaceChild(
      createElement(newVNode),
      parentElement.childNodes[index],
    );
  }

  // 5. 노드 업데이트 ( newVNode와 oldVNode의 타입이 같은데 속성이 다른 경우 )
  if (newVNode.type === oldVNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newVNode.props ?? {},
      oldVNode.props ?? {},
    );
  }

  // 재귀 ( 모든 children의 children의 ... 돌고 탈출 )
  const maxLength = Math.max(
    newVNode.children?.length ?? 0,
    oldVNode.children?.length ?? 0,
  );
  Array(maxLength)
    .fill(null)
    .forEach((_, i) =>
      updateElement(
        parentElement.childNodes[index],
        newVNode.children[i],
        oldVNode.children[i],
        i,
      ),
    );
}
