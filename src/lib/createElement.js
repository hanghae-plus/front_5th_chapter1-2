import { attributeRules, FALSY_VALUES, PRIMITIVE_TYPES } from "./utils";

export function createElement(vNode) {
  if (FALSY_VALUES.includes(vNode)) {
    return document.createTextNode("");
  }

  if (PRIMITIVE_TYPES.includes(typeof vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    $fragment.append(...vNode.map(createElement));

    return $fragment;
  }

  const { type, props, children } = vNode;
  const $el = document.createElement(type);

  updateAttributes($el, props);
  $el.append(...children.map(createElement));

  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props || {}).forEach(([key, value]) => {
    for (const rule of Object.values(attributeRules)) {
      if (rule.condition(key, value)) {
        return rule.apply($el, key, value);
      }
    }
    $el.setAttribute(key, value);
  });
}
