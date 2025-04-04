import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  container.innerHTML = ""; // updateElement() 방식으로 기존 DOM이랑 비교/업데이트 해야하는데,
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  // container.appendChild(createElement(vNode)); 를 참고해서 만들자
  // basic: 정규화 -> createElement -> 컨테이너에 담고 -> 이벤트 붙이기
  const normalizedVNode = normalizeVNode(vNode);
  const createdElement = createElement(normalizedVNode);
  container.appendChild(createdElement);
  setupEventListeners(container);
}
