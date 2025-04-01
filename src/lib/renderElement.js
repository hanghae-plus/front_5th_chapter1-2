// import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  // 0401 여러 자료 및 코드들을 참고해 순서에 대한 개념 적립
  // 1. createVNode를 통해 jsx를 vNode로 변환.
  // 2. vNode를 normalizeVNode를 통해 정규화.
  // 3. 정규화된 vNode를 createElement를 통해 DOM으로 변환.
  // 4. DOM을 container에 appendChild로 추가.
  if (!vNode) return;
  const normalizedVNode = normalizeVNode(vNode);
  if (container.childNodes.length === 0) {
    const getCreateElement = createElement(normalizedVNode);
    container.appendChild(getCreateElement);
  } else {
    updateElement(container, vNode);
  }
}
