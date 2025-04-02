/**
 * 가상 DOM 노드 생성
 * @param {string} type - 요소 타입
 * @param {Object} props - 요소 속성
 * @param {...any} children - 자식 요소
 * @returns {Object} - 가상 DOM 노드
 * Q 자식요소를 평탄화 하는 이유
 * A 
    1. 중첩된 배열 구조 정리 
      - React나 다른 가상 DOM 라이브러리에서 JSX를 사용할 때 자식 요소들이 배열 형태로 중첩되어 들어올 수 있따
        - 예를들어 
           <div>
            {[1, 2, 3].map(num => <span>{num}</span>)}
            <p>Hello</p>
          </div>
          이런 경우 자식 요소들이 
          [[<span>1</span>, <span>2</span>, <span>3</span>], <p>Hello</p>]
          위와 같이 중첩된 배열 형태가 됩니다.
    2. 일관된 데이터 구조 유지
      - 가상 DOM은 자식 요소들을 단일 레벨의 배열로 처리하는 것이 더 효율적입니다.
      - flat(Infinity)를 사용하여 모든 중첩을 제거하고 단일 레벨의 배열로 만듭니다.
    3. 렌더링 최적화
      - 평탄화된 구조는 DOM 업데이트와 비교(diffing) 과정에서 더 효율적으로 처리될 수 있습니다.
      - 중첩된 배열 구조를 처리하는 것보다 단일 레벨의 배열을 처리하는 것이 더 간단하고 빠릅니다.
    4. 불필요한 요소 제거
      - 코드에서 filter()를 통해 null, undefined, false 값을 제거하는 것도 중요한 부분입니다.
      - 이는 조건부 렌더링에서 불필요한 요소가 실제 DOM에 반영되는 것을 방지합니다.

    ex) 아래와 같은 구조가 있따고 생각해보자.
      <div>
        Hello
        {condition && ["world", "!"]}
      </div>
      -> 중첩된 배열 구조
       ["Hello", ["world", "!"]]
      -> 1. 이렇게하면 배열안에 배열이 있어서 처리하기 어려움
      -> 2. DOM 요소를 생성할 때 재귀적으로 처리해야됨 
      -> 3. 비교(diffing) 과정에서 더 복잡해짐
      -> 4. 불필요한 요소가 실제 DOM에 반영되는 것을 방지하기 위해 filter()를 사용해야됨
 */
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter(
        (child) => child !== null && child !== undefined && child !== false,
      ),
  };
}
