export function createElement(vNode) {
  if (vNode == null || typeof vNode === "boolean")
    return document.createTextNode("");
  if (typeof vNode === "string" || typeof vNode === "number")
    return document.createTextNode(String(vNode));
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((e) => fragment.appendChild(createElement(e)));
    return fragment;
  }
  if (typeof vNode.type === "string") {
    const el = document.createElement(vNode.type);
    const props = vNode.props || {};
    updateAttributes(el, props);
    []
      .concat(vNode.children || [])
      .forEach((c) => el.appendChild(createElement(c)));
    return el;
  }
  throw new Error();
}

function updateAttributes($el, props = {}) {
  for (const [key, value] of Object.entries(props)) {
    if (key === "children") continue;

    const attr = key === "className" ? "class" : key;

    if (typeof value === "boolean") {
      if (value) {
        $el.setAttribute(attr, "");
      } else {
        $el.removeAttribute(attr);
      }
    } else {
      $el.setAttribute(attr, value);
    }
  }
}
