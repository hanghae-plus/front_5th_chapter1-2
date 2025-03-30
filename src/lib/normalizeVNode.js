/**
 * 주어진 가상노드(vNode)를 표준화된 형태로 변환하는 역할
 * 다양한 타입의 입력을 처리하여 일관된 형식의 가상노드를 반환하여
 * DOM 조작이나 렌더링 과정에서 일관된 데이터 구조를 사용할 수 있도록 함
 *
 * 1. vNode가 null, undefined, boolean 타입일 경우, 빈 문자열 반환
 * 2. vNode가 문자열, 숫자일 경우 문자열로 변환하여 반환한다
 * 3. vNode의 타입이 함수일 경우, 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화한다.
 * 그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화, null또는 undefined값을 필터링하여 반환한다.
 * @param {*} vNode
 * @returns 

 */
export function normalizeVNode(vNode) {
  return vNode;
}
