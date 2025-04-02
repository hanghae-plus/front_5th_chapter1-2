/**
 * 가상 돔 노드 생성
 * @param {*} type 
 * @param {*} props 
 * @param  {...any} children 
 * @returns 
 * 
 * 나머지 매개변수(rest parameter)
가변 인자 수집: 함수 호출 시 전달되는 여러 인자들을 하나의 배열로 수집합니다.
유연성 제공: 함수를 호출할 때 몇 개의 인자가 전달될지 미리 알 수 없는 상황에서 유용합니다.
첫 번째 매개변수 type과 두 번째 매개변수 props 이후에 들어오는 모든 인자들을 children이라는 배열에 담습니다.
컴포넌트가 얼마나 많은 자식 요소를 가질지 미리 정할 수 없기 때문입니다. 이 방식을 통해 JSX 구문을 처리할 때 중첩된 구조를 효과적으로 표현할 수 있습니다.

console.log 출력을 보면 children이 배열 형태임을 확인할 수 있고, typeof children은 실제로 "object"로 출력됩니다(JavaScript에서 배열은 객체의 한 종류입니다).
 */

export function createVNode(type, props, ...children) {
  console.log("createVNode children", children);
  console.log("createVNode children type", typeof children);
  return {
    type: type,
    props: props,
    children: flattenChildren(children),
  };
}

function flattenChildren(children) {
  return children
    .flat(Infinity)
    .map((child) =>
      child === null || child === undefined || typeof child === "boolean"
        ? ""
        : child,
    )
    .filter((child) => child !== "");
}
