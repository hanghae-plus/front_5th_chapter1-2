import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let prevVNode = null;
let isEventSetup = false;

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  // 이벤트 위임은 최초 1회만
  if (!isEventSetup) {
    setupEventListeners(container);
    isEventSetup = true;
  }
  // // 전체 교체로 테스트
  // const $el = createElement(normalizedVNode);
  // container.replaceChildren($el);
  // prevVNode = normalizedVNode;

  // 최초 렌더링 시 → DOM 생성
  if (prevVNode === null) {
    const $el = createElement(normalizedVNode);
    container.replaceChildren($el);
  } else {
    // 이후 → diff 업데이트
    updateElement(container, normalizedVNode, prevVNode);
  }

  // 다음 비교를 위해 저장
  prevVNode = normalizedVNode;
}
