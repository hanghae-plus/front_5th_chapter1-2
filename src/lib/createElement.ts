import {
  ElementWithHandlers,
  HTMLEventType,
  HTMLTagType,
  VNode,
} from "@/types";
import { addEvent } from "./eventManager";

export function createElement(vNode: VNode | boolean | string) {
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }
  if (
    vNode === undefined ||
    vNode === null ||
    vNode === false ||
    vNode === true
  ) {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // normalizeVNode에서 생성된 텍스트 노드 처리
  if (vNode.type === null && vNode.props && vNode.props.textContent) {
    return document.createTextNode(vNode.props.textContent);
  }

  const element = document.createElement(vNode.type as HTMLTagType);
  if (vNode.props) {
    updateAttributes(element, vNode.props);
  }
  if (vNode.children && vNode.children.length > 0) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }
  return element;
}

function updateAttributes(
  $el: ElementWithHandlers,
  props: Record<string, any>,
) {
  if (!props) return;
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const eventType = key.toLowerCase().substring(2) as HTMLEventType;
      addEvent($el, eventType, props[key]);
      return;
    }
    if (key === "children") return;
    if (key === "textContent") return; // textContent 속성은 건너뜁니다
    if (key === "className") {
      $el.setAttribute("class", props[key]);

      return;
    }
    $el.setAttribute(key, props[key]);
  });
}
