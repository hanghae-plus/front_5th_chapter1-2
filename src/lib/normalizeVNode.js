import { inValidValues } from "./shared.js";

/**
 * dom Element 노드인 경우 컴포넌트 정규화
 */
function normalizeStringTypeVNode(vNode) {
  const children = vNode.children
    .map(normalizeVNode)
    .filter((v) => !inValidValues.includes(v));

  return {
    type: vNode.type,
    props: vNode.props,
    children: children,
  };
}

/**
 * vNode의 type은 "function" 또는 "string"
 * function인 경우 vNode는 컴포넌트이고, string인 경우는 일반 dom Element
 */
function isVNodeComponent(vNode) {
  return typeof vNode.type === "function";
}

export function normalizeVNode(vNode) {
  if (inValidValues.includes(vNode)) {
    return "";
  }

  const isPrimitive = typeof vNode === "string" || typeof vNode === "number";
  if (isPrimitive) {
    return String(vNode);
  }

  /**
   * vNode가 컴포넌트인 경우 (= typeof type이 함수인 경우)
   */
  if (isVNodeComponent(vNode)) {
    //vNode.type이 함수이므로 props와 children을 전달
    const component = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });

    // 컴포넌트 내용이 일반 dom element인 경우(=type이 string)인 경우와 컴포넌트인 경우를 나누어 처리
    return isVNodeComponent(vNode)
      ? normalizeVNode(component)
      : normalizeStringTypeVNode(component);
  }

  /**
   * vNode가 일반 dom element인 경우 (= typeof type이 string인 경우)
   */
  return normalizeStringTypeVNode(vNode);
}
