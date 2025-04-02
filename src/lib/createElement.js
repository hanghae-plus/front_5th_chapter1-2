import { addEvent } from "./eventManager";
import { getType, nonRenderableTypes } from "../utils";

export function createElement(vNode) {
  const type = getType(vNode);

  if (nonRenderableTypes.includes(type)) {
    return document.createTextNode("");
  }

  if (["string", "number"].includes(type)) {
    return document.createTextNode(String(vNode));
  }

  if (type === "object") {
    if (Array.isArray(vNode)) {
      const $fragment = document.createDocumentFragment();
      for (const child of vNode) {
        $fragment.appendChild(createElement(child));
      }
      return $fragment;
    }

    const $el = document.createElement(vNode.type);

    if (vNode.props) {
      for (const [key, value] of Object.entries(vNode.props)) {
        if (/^on[A-Z]/.test(key) && typeof value === "function") {
          const eventType = key.slice(2).toLowerCase();
          addEvent($el, eventType, value);
        } else if (/^data-/.test(key)) {
          $el.dataset[key.replace(/^data-/, "")] = value;
        } else if (typeof value === "boolean") {
          if (value) {
            // false일때는 무시
            $el.setAttribute(key, "");
          }
        } else {
          $el[key] = value;
        }
      }
    }

    if (vNode.children) {
      for (const child of vNode.children) {
        $el.appendChild(createElement(child));
      }
    }

    return $el;
  }
}
