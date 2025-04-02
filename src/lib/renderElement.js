import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldNode = null;

/**container에 빈 값이 들어있는 경우, 새로운 Element를 생성합니다. */
function creaetRenderElement(container, _normalizedVNode) {
  const _dom = createElement(_normalizedVNode);
  container.appendChild(_dom);
  oldNode = _normalizedVNode;
}

/**renderElement는 앞에서 작성된 함수들을 조합하여 vNode를 container에 렌더링하는 작업을 수행한다. */
export function renderElement(vNode, container) {
  const _normalizedVNode = normalizeVNode(vNode);

  container.innerHTML === ""
    ? creaetRenderElement(container, _normalizedVNode)
    : updateElement(container, _normalizedVNode, oldNode);

  setupEventListeners(container);
}
