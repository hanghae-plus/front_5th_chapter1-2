/**
 *
 * @param type 노드의 이름 ( 최상단의 element name )
 * @param props 노드의 속성
 * @param children 노드의 자식들
 * @returns {{children: FlatArray<*[], number>[], type, props}}
 */

export function createVNode(type, props, ...children) {
  // 자식은 평탄화 해야한다.
  // children = children.flat(Infinity);
  // // 랜더링 하지 않아야 할 것들을 예외한다.
  // children = children.filter(
  //   (c) => c !== false && c !== null && c !== undefined && c !== true,
  // );
  children = children
    .flat(Infinity)
    .filter(
      (contents) =>
        (contents !== false) & (contents !== null) && contents !== undefined,
    );
  // .filter((contents) => contents !== false && )
  return { type, props, children };
}

// jsx 문법
/**
 *  중괄호 안에 모든 요소를 js 표현식으로 넣을 수 있다., 그리고 이것들은 childredn 요소로 들어간다
 *  =>  <h1>
 *        Hello, {formatName(user)}!
 *      </h1>
 *      ==> children = [Hello, formatName(user), !]
 *
 */
