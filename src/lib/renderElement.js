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
  console.log("renderElement start");
  console.log("container: ", container.innerHTML);
  console.log("vNode: ", vNode);
  const normalizeNd = normalizeVNode(vNode);

  if (container.innerHTML.trim() === "") {
    console.log("renderElement 첫번째 호출!");
    container.innerHTML = "";

    // 여기가 최초 렌더링시? DOM을 생성..
    const createEl = createElement(normalizeNd);
    console.log("createEl: ", createEl.outerHTML);

    container.appendChild(createEl);
  } else {
    console.log("renderElement 두번째 호출!");
    // 2반쩨 호츨이므로 여기서 updateElement로 기본 DOM을 업데이트 한다.
    // parentElement, newNode, oldNode, index = 0
    console.log("normalizeNd: ", normalizeNd);
    console.log("normalizeNd[0]: ", normalizeNd.children[0].children);
    console.log("normalizeNd[1]: ", normalizeNd.children[1].children);
    console.log("previousVNode: ", previousVNode);
    console.log("previousVNode[0]: ", previousVNode.children[0].children);
    // 1번째랑 2번째 다른 것들을 넘김
    updateElement(container, normalizeNd, previousVNode);
  }

  previousVNode = normalizeNd;

  // updateElement.
  setupEventListeners(container);
  console.log("End");

  // return createEl;
}
