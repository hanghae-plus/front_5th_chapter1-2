import { isEmpty } from "../utils";

/**
 * normalizeVNode
 * @description vNode를 정규화하는 함수
 * 왜 정규화를 해야하나? createVNode를 통해 JSX파일이 vNode로 변환되는데
 * vNode는 다양한 형태로 변환될 수 있다. 이때 vNode를 정규화하여
 * DOM으로 변환할 수 있는 형태로 만들어야 한다.
 * @param {*} vNode
 * @returns
 */
export function normalizeVNode(vNode) {
  // CHILD를 순회할 때 처리 될 코드들 -----
  // 테스트코드 "null, undefined, boolean 값은 빈 문자열로 변환되어야 한다. (%s)" 에 대한 처리
  if (isEmpty(vNode)) {
    return "";
  }
  // 테스트코드 "문자열과 숫자는 문자열로 변환되어야 한다. (%s)" 에 대한 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }
  if (Array.isArray(vNode) && vNode.length === 1) {
    return vNode[0].toString();
  }
  // --------------------------------
  // 컴포넌트 정규화
  // 0401 function comopnent의 props에 대한 처리 문제 발생 // {onclick, props, children}
  // normalizeVNode({...vNode.type({ ...vNode.props, children: vNode.children }),}) 로 처리하니 문자열이 안들어감 해당처리 필요할듯.
  // 일단은 값은 들어가는디 children에 string[]으로 들어감... => 마지막엔 문자열로 들어가야함........아닌가?
  // falsy값은 자식에서 제거되야한다 실패 => 필터로 걸러내야할듯?

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }
  return {
    type: vNode.type,
    props: vNode.props,
    children: Array.isArray(vNode.children)
      ? vNode.children.filter((child) => !isEmpty(child)).map(normalizeVNode)
      : normalizeVNode(vNode.children),
  };
}
