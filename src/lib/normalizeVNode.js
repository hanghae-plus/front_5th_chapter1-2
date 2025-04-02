import { isComponent, isFalsy, isPrimitive } from "../utils/typeCheck";
/**
 * 가상 DOM 노드(vNode)를 표준화된 형태로 변환하는 함수
 * @param {*} vNode - 평탄화한 가상 DOM 노드
 * @param {Object} [vNode.type] - 노드의 타입 (HTML 태그명 또는 컴포넌트 함수)
 * @param {Object} [vNode.props] - 노드의 속성들
 * @param {Array} [vNode.children] - 자식 노드들의 배열
 * Q  null, undefined, boolean 값은 빈 문자열로 변환하는 이유
 * Q  문자열과 숫자는 문자열로 변환하는 이유
 */
export function normalizeVNode(vNode) {
  if (isFalsy(vNode)) {
    return "";
  }

  // 2. 문자열과 숫자는 문자열로 변환되어야 한다.
  if (isPrimitive(vNode)) {
    return String(vNode);
  }

  // 3. 컴포넌트를 정규화한다.
  if (isComponent(vNode)) {
    const props = {
      ...(vNode.props || {}),
      children: vNode.children, // childrend을 다시 넘겨서 재귀
    };
    const rendered = vNode.type(props);

    return normalizeVNode(rendered);
  }

  // 3-2. 자식 요소 정규화 + Falsy 값 처리
  if (vNode.children) {
    vNode.children = vNode.children
      .map((child) => normalizeVNode(child)) // 각 자식을 정규화
      .filter((child) => child !== ""); // 빈 문자열(falsy값) 제거
  }

  return vNode;
}
