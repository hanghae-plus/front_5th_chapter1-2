// import { createVNode } from "./createVNode.js";

export function normalizeVNode(vNode) {
  //주어진 가상 노드를 표준화된 형태로 변환하는 역할, 다양한 타입의 입력 처리, 일관된 가상 노드 반환 dom 조작, 렌더링 과정에서 데이터 구조를 활용하는 것이 목표
  //함수로 넘어오는 데이터를 어떻게 풀어주고 내보낼 수 있을까?
  // type이 함수인 경우 실행 이미 함수인 것들만 들어왔어.
  // 이거 두 번 호출되네.
  console.log("vNode");
  console.log(vNode);
  console.log("vNode's type");
  console.log(vNode.type());
  const testNode = vNode.type();
  console.log("testNode");
  console.log(testNode.type(testNode.children, testNode.props));
  const testNode2 = testNode.type(testNode.children, testNode.props);
  console.log("testNode2");
  console.log(testNode2.props["0"].type(testNode2.children, testNode2.props));
  /**
   * 
   * {
        type: 'ul', 이게 중요.
        props: {
          '0': { type: [Function: ListItem], props: [Object], children: [Array] },
          '1': { type: [Function: ListItem], props: [Object], children: [Array] },
          '2': { type: [Function: ListItem], props: [Object], children: [Array] }
        },
        children: []
      } 
   */

  //type이 function으로 저의 되어 있는데, 무엇을 정의한 것인지 내가 먼저 명확히 알아야 한다.

  // 이걸 만들어야 함수형 컴포넌트를 통과하겠군.
  return vNode;
}
