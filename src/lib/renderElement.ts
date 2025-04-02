import { ElementWithHandlers, VNode } from "@/types";
import { isValidVNode } from "@/utils/validator";
import { vDomStore } from "./../stores";
import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode: VNode, container: ElementWithHandlers) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  const normalizedVNode = normalizeVNode(vNode);
  const isVNodeObject = isValidVNode(normalizedVNode);

  if (!vDomStore.hasVDom() || container.childNodes.length === 0) {
    container.innerHTML = "";
    const element = createElement(normalizedVNode);

    setupEventListeners(container);

    container.appendChild(element);

    if (isVNodeObject) {
      vDomStore.saveVDom(normalizedVNode);
    }

    return element;
  } else {
    const previousVNode = vDomStore.get();
    updateElement(container, normalizedVNode, previousVNode);

    if (isVNodeObject) {
      vDomStore.saveVDom(normalizedVNode);
    }

    return container.firstChild;
  }
}
