import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  console.log(container, vNode, container._prevVNode);
  if (!vNode) {
    return;
  }

  // container에 _oldNode 없다면 최초 렌더링
  const isFirst = !container.oldNode;

  const normalizedVNode = normalizeVNode(vNode);

  if (isFirst) {
    console.log("최초 렌더링 시작");
    // 최초 렌더링시에는 createElement로 DOM을 생성하고
    const element = createElement(normalizedVNode);
    // container.replaceChildren(element); // ❌ 기존 DOM을 통째로 날리고 새로 추가함
    container.appendChild(element); // ✅ 기존 노드를 유지한 채 자식 요소 추가
  } else {
    console.log("이후 렌더링 시작");
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    updateElement(container, normalizedVNode, container.oldNode);
  }

  container.oldNode = normalizedVNode;
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
