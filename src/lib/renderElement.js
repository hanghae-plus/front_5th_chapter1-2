import { setupEventListeners, cleanupEvents } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  // 0. 이벤트 정리
  cleanupEvents(container);

  // 1. vNode 정규화
  const normalizedVNode = normalizeVNode(vNode);
  console.log("정규화된 노드:", normalizedVNode);

  // 2. 실제 DOM 요소 생성
  const element = createElement(normalizedVNode);
  console.log("생성된 DOM 요소:", element.tagName, element);

  // 3. container에 DOM 요소 추가
  if (element instanceof Node) {
    container.appendChild(element);
  }
  console.log("컨테이너에 추가된 후:", container.innerHTML);

  // 4. 이벤트 리스너 설정
  setupEventListeners(container);
}
