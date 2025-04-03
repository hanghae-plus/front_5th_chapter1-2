import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  const createdElements = createElement(normalizedVNode);

  // console.log("renderEl", vNode, container);
  // renderElement는 앞에서 작성된 함수들을 조합하여 vNode를 container에 렌더링하는 작업을 수행합니다
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  container.append(createdElements);
  updateElement(container, createdElements, createdElements);
  setupEventListeners(container);
}
