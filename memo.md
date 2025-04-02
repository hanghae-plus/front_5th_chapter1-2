# 과제 중 메모장

그래서 virtualDOM을 어케 만들라는 건데.

우선 실제 DOM과 비슷한 형태의 자바스크립트 객체를 만들어주어야 함.
이건 createVNode 함수로 구현

```js
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(),
  };
}
```

> 1.  type
>     실제 DOM 요소의 타입, 예: 'div', 'ul', 'input', 'button' 같은 태그 이름
>     ✅ 2. props
>     해당 요소의 속성들 (HTML 속성 또는 이벤트 핸들러 등), 예: { id: 'app' }, { className: 'remove' }
>     ✅ 3. children
>     해당 요소의 자식들 (문자열 텍스트 또는 또 다른 virtualDom 객체)
>     .flat()을 쓰는 이유는 중첩된 배열이 들어올 수 있기 때문 (JSX에서 여러 계층의 자식이 올 수 있음)

이렇게 만들어진 vNode를 실제 DOM으로 변환해줘야 함.

이를 위해 필요한게 createElement 함수

VNode의 형태는 { type, props, children } 이렇게 생겼는데, normalizeVNode는 어쩌라는거지.
문자열 | Node 의 리턴 타입을 갖는걸까.

createElement에서 이걸 써야하는데, string이거나 Node를 분기처리해서 사용하는 듯.
-> 잘못 생각함. normalizeVNode는 VNode -> createElement -> normalizeVNode

텍스트 노드란? https://developer.mozilla.org/ko/docs/Web/API/Text
DocumentFragment 란? https://developer.mozilla.org/ko/docs/Web/API/DocumentFragment

아무튼, 이렇게 만들어진 vNode를 실제 DOM으로 변환해줘야 함.
이를 위해 필요한게 createElement 함수
여기서는 노드를 만들고, 속성(event, style, class, id 등)을 추가해줌.

속성은 updateAttributes으로, 이벤트는 addEvent로 추가해줌.

이벤트는 기존에 배웠던 방식인, 최상단으로 이벤트 핸들러를 등록하는 방식으로 추가해줘야할듯.

addEvent는 element에 이벤트 핸들러를 등록해야하는데, 아마 최상단에 해당 이벤트를 등록하면 element를 제대로 찾을 수 있을까?
특정 id나 뭔가를 사용해서 전역(root)에서 접근할 수 있는 방법을 찾아야될 듯 하다.
-> Map으로 묶어서 관리하자.
-> WeakMap이라는 개념이 있네.
[WeakMap](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)은 키가 참조되지 않으면 자동으로 소멸됨

그렇다면 WeakMap으로 키에 element를 넣고, 핸들러를 밸류로 넣어서 관리하면 되겠네.

- 여기서 고민한 부분: remove 이벤트로 이벤트를 제거했는데, weakmap 자체가 남아있으면 어쩌지? remove마다 weakmap 내부를 확인후 제거해줘야하나?
- removeEvent는 element의 생명주기를 같이 가져가도록 만들어 removeEvent가 발생하는 시점은 element가 죽었을 때, 즉 해당 키 값을 weakmap으로 관리하기 때문에 삭제될 것임
- 라고 생각했는데, 그냥 element가 사라지면 없어지니까 상관 없을듯. 그러면 removeEvent는 언제 사용되는거지?

- 결국 weakMap 삭제 -> iterable 하지 않아서 내부의 element에 event를 넣어줄 수 없음

```js
for (const [element, handler] of elementMap) {
  if (element.contains(event.target)) {
    handler.call(element, event);
  }
}
```

handler.call (function.call)에 대한 학습
-> function.call(thisArg, ...args)는 함수 function을 this를 지정해서 실행하는 방식
-> handler.call(element, event) -> 즉, element에 해당 handler를 실행하겠다
-> 마치 element.handler(event) 같은 느낌(element에 handler 메서드가 존재하지 않기 때문에 이런 방식으로 구현)

normalizeVNode 이슈
-> 함수형 컴포넌트 처리가 어려움
-> 함수형 컴포넌트의 경우 vNode의 type이 함수로 리턴, 그래서 그부분을 따로 분기처리해서 처리해줘야함
-> vNode.type 자체가 함수이기 때문에, 해당 함수에 props와 children을 넣어서 실행시켜줘야함

이벤트 관리를 어떻게 해야될까
-> 기존 컴포넌트가 제거되면 이벤트도 제거해야되는데

// Q. basic에서는 renderElement에서 container에 삽입하고 이벤트만 등록하라고 되어있는데, 아무리봐도 update를 해줘야할 것 같음. 근데 해당 범위는 basic이 아니라 advanced라 다른 방안이 있는지 궁금

-> 내가 잘못 생각함. 애시당초 이슈는 renderElement 시행할 때마다 container에 이벤트가 쌓여서 그럼. 그것만 중복방지해주면 해결완료
-> 삭제된 놈에 대해서는 어차피 엘리먼트와 맵이 되어있어 상관없음.

basic 테스트 코드 중 마지막 2문제에서 오랜 시간 소요

- 동적으로 추가된 요소에도 이벤트가 정상적으로 작동해야 한다 -> 루트를 기억하는 map을 만들어, 해당 루트에 같은 이벤트 타입이 존재하면 이벤트를 등록하지 않음
- 이벤트 핸들러가 제거되면 더 이상 호출되지 않아야 한다 -> appendChildren 대신 replaceChildren 사용

### 이제 심화를 해보자

- 우선 updateElement 함수를 구현해야함. 여기에 사용되는 알고리즘
- 리액트는 diffing 알고리즘을 사용하는 것으로 알려져있음.
- https://devocean.sk.com/blog/techBoardDetail.do?ID=165601

#### 내 접근 방식

- 각 노드에 대해 전처리(null, undefined 처리 등) 후
- 먼저 타입비교를 통해 다른 타입일 경우 그냥 oldNode를 newNode로 대체해버리고,
- 같은 타입일 경우, 재귀를 돌려가며 실제로 달라진 부분을 찾는 diffing 알고리즘을 구현해서 추가
- 실제로 달라진 부분을 찾으면 replace 및 속성 업데이트

#### 문제점

- 내부 텍스트 노드만 변경됐을 때는, 기존 노드가 삭제되면 안된다
- 엥, 노드 구조가 도대체 어떻게 생겨먹은거지?
  > ElementNode (type: "h1", attributes: { class: "title" })
  > └── TextNode ("Hello")
- 태그, 속성, 텍스트노드 중 하나가 변경되어도 나머지 둘에는 영향을 끼치면 안된다.
- 그래서 달라지는 애만 변경하도록 적용했는데도 계속 새로운 노드를 참조함
- 문제를 확인해봤더니, renderElement에서 애시당초 updateElement에 넣어주는 노드가 실제 DOM에 렌더링된 내용을 넣어줘서 문제
- 그렇다면 기존 DOM에 업로드 된 vNode를 기억해놔야할까?
- Map을 활용해 기존 노드들 저장

> 미친듯한 무한렌더

- / -> profile 이나 profile -> / 이렇게 이동시 무한렌더링
- login 페이지로 갈 때는 괜찮은데

아마 기존의 renderElement에서는 createElement를 통해 새로운 노드를 만들었고, 그러다보니 이벤트위임도 기존의 것은 날리고 새로 등록되는 형식이었음.
하지만 updateElement로 처리하니, 이벤트가 중복으로 쌓여가는 모습인듯.

흠... 이벤트 리무브를 제대로 해줬는데도 똑같이 무한 렌더가 돈다...
뭐가 문젤까...

-> updateAttributes에서 이벤트를 자꾸 지우고 다시 추가해서 무한렌더가 돌았음.
-> 코드 딱 두 줄 때문에 이렇게 많은 시간을 소요하다니...
-> 진짜 뇌빼고 코딩하기 금지

마지막 이슈
userStorage에 저장된 정보는 playwright에서 null로 잡힘
왜인지는 모르겠는데, globalStore에 저장된 정보를 사용하는 것으로 변경

// 질문)
state가 엮이면, vNode와 함께 어떻게 보관해야할까?
리액트는 key에 맵핑한다고 되어있는데

## ts 전환

- 우선 typescript 설치
- tsconfig.json 생성 및 설정
- vite.config.js에서 build target을 es2020으로 설정
- 이후 디펜던시가 가장 적은 부분부터 마이그레이션 시작

- 이슈 발생 createVNode에서 ...children으로 받아오던 것이 무조건 array가 아님.
- 그런데 기존 코드에서는 무조건 array라고 생각해서 children을 flatten에 넣고 돌려버림

- 와, 생각보다 js 믿고 개판으로 때려박은게 많았음
- 그리고 vNode와 실제 node간의 props, event 등의 타입이 다르게 적용되던 부분들 처리해주기 까다로웠음
- 그렇게 로직 파일들을 다 수정해주고... 이제 진짜 큰 거 온다.
- 바로바로... JSX를 TSX로 바꿔주기

#### TSX

- 'JSX.IntrinsicElements' 인터페이스가 없으므로 JSX 요소는 암시적으로 'any' 형식입니다.ts(7026)
- 일단 이런 에러가 나기 시작함

- 음 그런게 있군. tsconfig에서 `"jsx": "react",`를 수정해야하나?
- (`"jsx": "preserve",`나 `"jsx": "react-jsx",`로 해야하나?)

> react: JSX를 수동 팩토리(createVNode)로 변환
> react-jsx: React 17+ 자동 변환 방식 (JSX → jsx-runtime), 리액트 전용
> preserve: TypeScript가 JSX 문법을 변환하지 않고 그대로 출력.이건 보통 Babel이나 SWC 같은 JS 변환 툴이 JSX를 처리하게 하고 싶을 때 사용

- 그렇다면 다른 해결 방법
- `jsx.d.ts` 파일 추가 -> JSX.IntrinsicElements와 관련 타입을 정의

```ts
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { VNode, Props } from "../lib/vdom/index";

declare global {
  namespace JSX {
    // HTML 태그를 사용할 수 있게 함
    interface IntrinsicElements {
      [elemName: string]: Props;
    }

    // JSX가 반환하는 타입 정의
    interface Element extends VNode {}
    // 사용자 정의 컴포넌트를 쓸 때 필요한 선언
    interface ElementClass {}
    // 사용자 정의 컴포넌트의 props 타입 추론 기준이 되는 속성 이름 설정
    interface ElementAttributesProperty {
      props: {};
    }
  }
}
```

- `/** @jsx createVNode */`: JSX를 사용할 때 어떤 함수로 변환할지를 지정하는 주석

- 마지막으로 테스트 코드에서 jsx를 tsx로 수정해주고, 테스트코드는 js로 관리되는 중이니 eslint 안걸리도록 변경

## 리팩토링

- 관심사 분리

  > 하나로 관리되던 globalStore를 userStore와 postStore로 분리, 각각의 state와 actions를 분리해서 관리
  > 각각에 subscribe render를 추가해서 렌더링 함수를 분리해서 관리

  > 폼핸들러 분리하는데 고생함
  > 일단 받는 데이터도 너무 다르고, 중복되는 요소가 별로없음. 하나는 폼도 아님.
  > 그래서 폼으로 감싸주고, 공통 요소를 뽑아서 하나의 함수로 만들고, 해당 함수를 중첩해서 사용(class형 쓸까하다가 그냥 함수형으로 함)
  > 그리고 store도 따로 나눴는데, form도 나눠야될 거 같아서 나눔


## 멘토링

건강한 조직일수록, “도움을 요청” 했을 때 신뢰를 더 빠르게 쌓아갈 수 있음.

- 도움을 요청한다는 것 = 취약점을 드러내는 것
- 취약점을 드러냈을 때, 사람들이 공격을 하는 게 아니라 도움을 주는 조직이라면 건강한 조직.
- (책) 최고의 팀은 무엇이 다른가

https://typedoc.org/
