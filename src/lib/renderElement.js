import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 이전 vNode값을 담는 변수
let previousVNode = null;

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  // container가 div 하나임
  const normalizeNd = normalizeVNode(vNode);

  if (container.innerHTML.trim() === "") {
    container.innerHTML = "";

    // 여기가 최초 렌더링시? DOM을 생성..
    const createEl = createElement(normalizeNd);

    container.appendChild(createEl);
  } else {
    // 2반쩨 호츨이므로 여기서 updateElement로 기본 DOM을 업데이트 한다.
    // parentElement, newNode, oldNode, index = 0
    // 1번째랑 2번째 다른 것들을 넘김
    console.log("newNode: ", normalizeNd);
    console.log("oldNode: ", previousVNode);

    updateElement(container, normalizeNd, previousVNode);
  }

  previousVNode = normalizeNd;

  // updateElement.
  setupEventListeners(container);

  // return createEl;
}
