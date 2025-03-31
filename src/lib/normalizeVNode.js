// import { createVNode } from "./createVNode.js";

export function normalizeVNode(vNode) {
  //null ,undefined 처리
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  let newVNode = {};
  let renderNode = {};

  if (typeof vNode.type === "function") {
    //vNode.type(children, props) 로 순회
    const props = { children: vNode.children, ...(vNode.props ?? {}) };
    renderNode = vNode.type(props);
    return normalizeVNode(renderNode);
  }

  if (typeof vNode === "object" && vNode.children) {
    newVNode.type = vNode.type;
    newVNode.props = vNode.props;
    newVNode.children = vNode.children.map(normalizeVNode);
  }

  // children 처리
  if (Array.isArray(vNode.children)) {
    // 자식 노드들을 정규화하고 falsy 값 제거
    newVNode.children = vNode.children.map(normalizeVNode).filter(Boolean); // null, undefined, "", false 등의 falsy 값 모두 제거
  } else {
    // 자식이 없는 경우
    newVNode.children = [];
  }

  /**
     *   props: {
    '0': { type: [Function: ListItem], props: [Object], children: [Array] },
    '1': { type: [Function: ListItem], props: [Object], children: [Array] },
    '2': { type: [Function: ListItem], props: [Object], children: [Array] }
  },
     */
  // 정의한 속성을 삽입한다.
  // Object.entries(vNode.props || {})
  //   .filter(([attr, value]) => value)
  //   .forEach(([attr, value]) => $el.setAttribute(attr, value));

  // const children = vNode.children.map(normalizeVNode);

  // children.forEach((child) => $el.appendChild(child));
  // console.log($el);
  // return $el;

  // const firstArray = Object.entries(vNode.props || {});
  // console.log("firstArray", firstArray);
  // const filteredArray = Object.entries(vNode.props || {}).filter(
  //   ([attr, value]) => value,
  // );
  // console.log("filteredArray", filteredArray);
  //지금 이게 덜됬어.! 한번 더되야되.!

  /**
     * test 결과값
     * 
     * Object {
  "children": Array [
    Object {
      "children": Array [
        "- ",
        "Item 1",
      ],
      "props": Object {
        "className": "list-item ",
        "id": "item-1",
      },
      "type": "li",
    },
    Object {
      "children": Array [
        "- ",
        "Item 2",
      ],
      "props": Object {
        "className": "list-item ",
        "id": "item-2",
      },
      "type": "li",
    },
    Object {
      "children": Array [
        "- ",
        "Item 3",
      ],
      "props": Object {
        "className": "list-item last-item",
        "id": "item-3",
      },
      "type": "li",
    },
  ],
  "props": Object {},
  "type": "ul",
}
     */

  // Object.entries(newComponent || {})
  //   .filter(([attr, value]) => console.log("value", value))
  //   .map(([attr, value]) => value.type(value.children, value.props));

  // console.log("renderNode2", renderNode2);
  // return normalizeVNode(renderNode2);

  //주어진 가상 노드를 표준화된 형태로 변환하는 역할, 다양한 타입의 입력 처리, 일관된 가상 노드 반환 dom 조작, 렌더링 과정에서 데이터 구조를 활용하는 것이 목표
  //함수로 넘어오는 데이터를 어떻게 풀어주고 내보낼 수 있을까?
  // type이 함수인 경우 실행 이미 함수인 것들만 들어왔어.
  // 이거 두 번 호출되네.
  // console.log("vNode");
  // console.log(vNode);
  // { type: [Function: TestComponent], props: null, children: [] }
  // console.log("vNode's type");
  // console.log(vNode.type());
  /**
   * {
   *  type: [Function: UnorderedList],
   *  props: null,
   *  children: [
   * { type: [Function: ListItem], props: [Object], children: [Array] },
    { type: [Function: ListItem], props: [Object], children: [Array] },
    { type: [Function: ListItem], props: [Object], children: [Array] }
     ]
   * }
   */
  // const testNode = vNode.type();
  // console.log("testNode");
  // console.log(testNode.type(testNode.children, testNode.props));
  /**
   * 
   * {
  type: 'ul',
  props: {
    '0': { type: [Function: ListItem], props: [Object], children: [Array] },
    '1': { type: [Function: ListItem], props: [Object], children: [Array] },
    '2': { type: [Function: ListItem], props: [Object], children: [Array] }
  },
  children: []
}
   */
  // const testNode2 = testNode.type(testNode.children, testNode.props);
  // console.log("testNode2");
  // console.log(testNode2.props["0"].type(testNode2.children, testNode2.props));
  /**
   * { type: 'li', props: { className: 'list-item ' }, children: [ '- ' ] }
   */

  //type이 function으로 저의 되어 있는데, 무엇을 정의한 것인지 내가 먼저 명확히 알아야 한다.
  //결국엔 type을 확인하면서 돌아야하고 type확인할때, children과 props를 전달해야한다는 것이다.

  // 이걸 만들어야 함수형 컴포넌트를 통과하겠군.
  return newVNode;
}
