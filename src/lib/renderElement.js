// import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

/**
 *
 * @param {*} vNode - 렌더링할 요소
 * @param {*} container - 렌더링할 컨테이너
 * @returns
 */

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  const realDom = createElement(normalizedVNode);
  console.log(normalizedVNode);
  console.log(vNode, container);

  console.log("realDom", realDom);

  container.appendChild(realDom);
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
}
