/**
 * 가상 DOM 노드 타입 정의
 * @typedef {Object} VNode
 * @property {keyof HTMLElementTagNameMap|Function} type - 노드의 타입 ( HTML 태그명 or 컴포넌트 함수 )
 * @property {Object|null} props - 노드의 속성들
 * @property {Array<string|number|VNode>} children - 자식 노드들
 */

/**
 * 가상 돔 노드를 정규화
 *
 * @param {VNode|null|undefined|boolean|number|string} vNode - 정규화할 가상 돔 노드 or 원시 값
 * @returns {string|VNode} 정규화된 가상 돔 노드 or 문자열
 */
export function normalizeVNode(vNode) {
  const getTypes = (vNode) => (vNode === null ? "null" : typeof vNode);

  const vNodeType = getTypes(vNode);
  const invalidTypes = ["null", "undefined", "boolean"];

  if (invalidTypes.includes(vNodeType)) {
    return "";
  }
  if (vNodeType === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const renderedNode = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });

    return normalizeVNode(renderedNode);
  }

  const normalizedChildren = vNode.children
    ? vNode.children
        .filter((child) => !invalidTypes.includes(getTypes(child)))
        .map((child) =>
          typeof child === "object" ? normalizeVNode(child) : child,
        )
    : [];

  return { ...vNode, children: normalizedChildren };
}
