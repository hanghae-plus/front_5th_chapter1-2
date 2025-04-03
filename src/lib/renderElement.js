import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 비교를 위한 이전 VNode
let previousVNods = null;

export function renderElement(vNode, container) {
  let isInit = true;
  const normalizedVNode = normalizeVNode(vNode);
  console.log('normalizedVNode', normalizedVNode);
  // 최초 렌더링 시
  container.innerHTML === '' ? isInit = true : isInit = false;
  
  if (isInit) {
    // 최초 렌더링시에는 createElement로 DOM을 생성
    const element = createElement(normalizedVNode);
    console.log('element', element);
    container.appendChild(element);
  } else {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    updateElement(container, normalizedVNode, previousVNods);
  }
  previousVNods = normalizedVNode;
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
