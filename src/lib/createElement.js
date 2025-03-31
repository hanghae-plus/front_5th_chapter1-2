export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }

  if (vNode.length) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((it) => {
      const tag = document.createElement(it.type);
      tag.textContent = it.children.flat(Infinity);
      $fragment.appendChild(tag);
    });
    return $fragment;
  }

  const $el = document.createElement(vNode.type);
  updateAttributes($el, vNode.props);

  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childNode = createElement(child);
      $el.appendChild(childNode);
    });
  }

  return $el;
}

function updateAttributes($el, props) {
  if (!props) return;
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }
    $el.setAttribute(key, value);
  });
}
