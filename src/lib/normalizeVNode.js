export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (vNode.children) {
    vNode.children = vNode.children?.map(normalizeVNode).filter(Boolean);
  }

  if (typeof vNode.type === "function") {
    const component = vNode.type;
    const componentProps = vNode.props;
    const children = vNode.children?.map(normalizeVNode);
    /**
      vNode: {
        type: [Function: ListItem],
        props: { id: 'item-3', className: 'last-item' },
        children: [ 'Item 3' ]
      }
    */

    return normalizeVNode(component({ children, ...componentProps }));
    /**
     {
        type: 'li',
        props: { id: 'item-3', className: 'list-item last-item' },
        children: [ '- ' ]
      }
    */
  }

  return vNode;
}
