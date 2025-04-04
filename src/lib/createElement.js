import { addEvent } from "./eventManager";

/**
  vNode -> 실제 DOM 요소로 변환
 */
export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  /**
    [
      { type: 'div', props: null, children: [ '첫 번째' ] },
      { type: 'span', props: null, children: [ '두 번째' ] }
    ]
   */
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((childVNode) => {
      /**
        childVNode: { 
           type: 'div', 
           props: null, 
           children: [ '첫 번째' ] 
        }
       */
      fragment.appendChild(createElement(childVNode));
    });

    return fragment;
  }

  const isTag = typeof vNode.type === "string";
  if (isTag) {
    const component = vNode.type;
    /**
     * div
     * span
     */

    const $element = document.createElement(component);
    /**
     * HTMLDivElement
     * HTMLSpanElement
     */

    if (vNode.props) {
      updateAttributes($element, vNode.props);
    }

    if (vNode.children) {
      vNode.children.forEach((child) => {
        /**
         * child: 텍스트
         * child: { type: 'span', props: null, children: [ 'span 안의 텍스트' ] }
         */
        const $childElement = createElement(child);
        $element.appendChild($childElement);
      });
    }

    return $element;
  }

  if (typeof vNode.type === "function") {
    const component = vNode.type;
    const $element = component();
    return $element;
  }
}

// [DOM attributes & event listeners]
function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    // remove attribute
    if (value === null || value === undefined) {
      $el.removeAttribute(key);
      return;
    }

    // style
    if (key === "style" && typeof value === "string") {
      $el.style.cssText = value;
      return;
    }

    // className
    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }

    // event listener(onClick, onChange, onMouseEnter, onMouseLeave, ...)
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, value);
      return;
    }

    // data-* attributes
    if (key.startsWith("data-")) {
      $el.setAttribute(key, value);
    } else {
      $el[key] = value;
    }
  });
}
