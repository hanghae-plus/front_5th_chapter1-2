import { isCheckStartOn, normalizeEventName } from "../utils/eventUtils";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (typeof vNode.type === "function") {
    throw new Error("안돼 돌아가");
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  }

  const el = document.createElement(vNode.type);
  vNode.children.map(createElement).forEach((child) => el.appendChild(child));

  updateAttributes(el, vNode.props);
  return el;
}

function updateAttributes($el, props) {
  Object.entries(props || {}).forEach(([attribute, value]) => {
    switch (true) {
      case isCheckStartOn(attribute):
        addEvent($el, normalizeEventName(attribute), value);
        break;
      case attribute === "className":
        $el.setAttribute("class", value);
        break;
      default:
        $el.setAttribute(attribute, value);
    }
  });
}
