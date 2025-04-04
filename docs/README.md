## 과제 체크포인트

### 배포 링크

<!--
배포 링크를 적어주세요
예시: https://<username>.github.io/front-5th-chapter1-1/

배포가 완료되지 않으면 과제를 통과할 수 없습니다.
배포 후에 정상 작동하는지 확인해주세요.
-->

https://nincoding.github.io/front_5th_chapter1-2/

### 기본과제

#### 가상돔을 기반으로 렌더링하기

- [x] createVNode 함수를 이용하여 vNode를 만든다.
- [x] normalizeVNode 함수를 이용하여 vNode를 정규화한다.
- [x] createElement 함수를 이용하여 vNode를 실제 DOM으로 만든다.
- [x] 결과적으로, JSX를 실제 DOM으로 변환할 수 있도록 만들었다.

#### 이벤트 위임

- [x] 노드를 생성할 때 이벤트를 직접 등록하는게 아니라 이벤트 위임 방식으로 등록해야 한다
- [x] 동적으로 추가된 요소에도 이벤트가 정상적으로 작동해야 한다
- [x] 이벤트 핸들러가 제거되면 더 이상 호출되지 않아야 한다

### 심화 과제

#### 1) Diff 알고리즘 구현

- [x] 초기 렌더링이 올바르게 수행되어야 한다
- [x] diff 알고리즘을 통해 변경된 부분만 업데이트해야 한다
- [x] 새로운 요소를 추가하고 불필요한 요소를 제거해야 한다
- [x] 요소의 속성만 변경되었을 때 요소를 재사용해야 한다
- [x] 요소의 타입이 변경되었을 때 새로운 요소를 생성해야 한다

#### 2) 포스트 추가/좋아요 기능 구현

- [x] 비사용자는 포스트 작성 폼이 보이지 않는다
- [x] 비사용자는 포스트에 좋아요를 클릭할 경우, 경고 메세지가 발생한다.
- [x] 사용자는 포스트 작성 폼이 보인다.
- [x] 사용자는 포스트를 추가할 수 있다.
- [x] 사용자는 포스트에 좋아요를 클릭할 경우, 좋아요가 토글된다.

## 과제 셀프회고

<!-- 과제에 대한 회고를 작성해주세요 -->

> 트러블 슈팅

1. **Github Pages에 SPA를 배포**하는 과정에서 **배포 실패와 라우팅 에러**로 인해 많은 시간을 소비했다. (지난 1주차 라우팅 구현 과제와 이어지는 내용)

2. **가상 DOM**을 이용한 렌더링 구현 과정에서 **하나의 업데이트 발생시 모든 노드를 새로 생성하는 문제**가 있었다. (심화 과제 1번)

3. **DOM 업데이트시 이벤트 핸들러의 참조가 제대로 동작하지않는 문제**가 발생했다. (심화 과제 1번 + 2번)

### 기술적 성장

<!-- 예시
- 새로 학습한 개념
- 기존 지식의 재발견/심화
- 구현 과정에서의 기술적 도전과 해결
-->

> 1. Github Pages에 SPA를 배포할때 라우팅 에러 해결

- 문제 발생 : Github Pages에 SPA를 배포하니, 기본 페이지를 읽어들이지 못하고 브라우저상에서 라우팅 에러가 발생했다.

- 원인 분석 :

  - 1-1 : Github Pages는 기본적으로 정적 파일을 서빙하기 때문에, SPA의 라우팅 방식을 인식하지 못한다.

    - `https://<username>.github.io/front-5th-chapter1-2/login` 와 같은 형식으로 접근하면, Github Pages는 `login.html`을 찾으려 하지만, 실제로는 `index.html`만 존재하기 때문에 브라우저에 404 에러가 발생한다.
    - 따라서 라우팅에 대한 별도의 처리가 필요하다.

  - 1-2 : Github Pages로 `build` 와 `deploy`를 하는 과정 중 누락된 부분이 존재했다.
    - `build` 와 `deploy` 명령어를 통해 `vite` 앱이 올바르게 빌드 및 배포가 진행되지는 확인이 필요하다.

- 해결 과정 :

- 1-1 : `public` 디렉토리에 `404.html` 파일을 추가하여, 라우팅 에러가 발생했을 때 이 파일을 서빙하도록 한다.

  [참고링크 : spa-github-pages-ko](https://github.com/sujinleeme/spa-github-pages-ko)

```html
<!-- 404.html--->
<script type="text/javascript">
  var pathSegmentsToKeep = 1;
  var l = window.location;
  var pathname = l.pathname;
  var search = l.search;
  var hash = l.hash;
  var pathParts = pathname.split("/");
  var basePath = pathParts.slice(0, 1 + pathSegmentsToKeep).join("/");
  var remainingPath = pathParts.slice(1 + pathSegmentsToKeep).join("/");
  var redirectUrl =
    l.protocol +
    "//" +
    l.hostname +
    (l.port ? ":" + l.port : "") +
    basePath +
    "/?p=/" +
    remainingPath +
    (search ? "&q=" + search.slice(1).replace(/&/g, "~and~") : "") +
    hash;

  l.replace(redirectUrl);
</script>
```

- 1-2 : `index.html` 파일에서 클라이언트 라우팅 로직을 추가하여, 라우팅 에러가 발생했을 때 이를 해결할 수 있도록 연결한다.

```html
<!-- index.html -->
<script type="text/javascript">
  (function (l) {
    if (l.search) {
      var q = {};
      l.search
        .slice(1)
        .split("&")
        .forEach(function (v) {
          var a = v.split("=");
          q[a[0]] = a.slice(1).join("=").replace(/~and~/g, "&");
        });
      if (q.p !== undefined) {
        window.history.replaceState(
          null,
          null,
          l.pathname.slice(0, -1) +
            (q.p || "") +
            (q.q ? "?" + q.q : "") +
            l.hash,
        );
      }
    }
  })(window.location);
</script>
```

<br/>

`404.html`에서 현재 URL을 분석하고, 리다이렉트 URL을 `?p=/login` 형식으로 변환하여 `index.html`로 이동시킨다.

`index.html`이 로드되면, JavaScript가 `window.location.search` 값을 읽어 `?p=/login`과 같은 정보를 확인한다.

이를 기반으로 브라우저의 `history.replaceState()`를 사용해 원래 경로 (`/login`)를 복원하여 SPA 라우팅이 정상적으로 작동하도록 만든다.

<br/>

- 1-3. 배포환경과 개발환경일때 Base URL의 라우팅 처리

```js
// 여기서 VITE_BASE_URL는 '/front_5th_chapter1-2' 형식으로 접근
const baseUrl = import.meta.env.VITE_BASE_URL ?? "/";
```

GitHub Pages에서 특정 리포지토리를 배포할 때, 기본적으로 `https://<username>.github.io/<repository-name>/` 형태로 접근해야 한다.

여기서 `<repository-name>`이 `front_5th_chapter1-2`라면, 리포지토리의 이름이 곧 URL 경로(서브 디렉토리)가 된다.

```js
// createRouter.js의 getPath
const getPath = () => {
  const fullPath = window.location.pathname;
  const path =
    baseUrl === "/"
      ? fullPath
      : fullPath.replace(new RegExp(`^${baseUrl}`), "");

  return path;
};

// createRouter.js의 push
const push = (path) => {
  const url = baseUrl === "/" ? path : `${baseUrl}${path}`;
  window.history.pushState(null, null, url);

  notify();
};
```

배포환경과 개발환경일때 다르게 처리한 Base URL을 `createRouter` 에서 반영하여 라우팅 처리를 실행시킨다.

- 1-4. `vite.config.js`에서 설정한 환경변수를 반영하고`build.rollupOptions.input` 옵션 추가

```js
// vite.config.js
import { resolve } from "path";
    ...

    base: env.VITE_BASE_URL ?? "/",
     build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, "index.html"),
            404: resolve(__dirname, "404.html"),
          },
        },
      },

    ...

```

GitHub Pages에서 SPA 라우팅을 처리하기 위해 `404.html`을 사용하므로,배포과정에서 `404.html`을 포함해야 한다.

하지만 기본적으로 Vite는 `index.html` 파일만 빌드하기 때문에, `404.html` 파일을 포함하기 위해서 `build.rollupOptions.input` 옵션을 추가해서 빌드과정에 포함될 수 있도록 추가했다.

- 1-5. `gh-pages`를 이용하여 배포 성공

```json
// package.json

// 배포 환경에 맞는 홈페이지 설정
 "homepage": "https://nincoding.github.io/front_5th_chapter1-2",

// 배포 명령어 추가
"scripts": {
    "gh-pages": "bash gh-pages-publish.sh",
    "deploy": "pnpm build && gh-pages -d dist"
}
```

결과적으로 `gh-pages` 브랜치에 배포에 필요한 파일들을 빌드하고, Github Pages에 SPA를 정상적으로 배포하고 브라우저상에서 발생하는 라우팅 에러를 해결할 수 있게되었다.

<br/>

---

<br/>

> 2. diff 알고리즘을 통해 가상DOM 렌더링 최적화

- 문제 발생 : `renderElement()`가 실행될 때마다, `container` 내부의 모든 요소가 다시 리렌더링됨 (불필요한 전체 리렌더링 발생)

![](https://velog.velcdn.com/images/ninto_2/post/4070909a-7974-4a6a-8439-0af53aca659e/image.jpg)

- 원인 분석 :

```js
// diff 알고리즘을 적용하지 않은 초기의 렌더링 로직

export function renderElement(vNode, container) {
  // vNode를 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 기존 DOM이 없으면 새로 생성
  if (!container.firstChild) {
    const newElement = createElement(normalizedVNode);
    container.appendChild(newElement);
  } else {
    // 기존 DOM이 있으면 업데이트
    updateElement(container, normalizedVNode, container.firstChild);
  }

  // 이벤트 리스너 설정
  const cleanup = setupEventListeners(container);

  // cleanup 함수를 반환하여 필요 시 이벤트 리스너를 제거할 수 있도록 함
  return cleanup;
}
```

- 2-1 : 실제 DOM과 가상 DOM(vNode)을 비교하는 문제

  - 실제 DOM 노드(`container.firstChild`)을 비교 대상으로 사용하고 있다.
    - 이전 가상 DOM(vNode)을 저장하는 구조가 없고, 실제 DOM 노드와 새로운 가상 DOM을비교하므로, 이전 가상 DOM의 속성이나 상태를 효율적으로 비교할 수 없다.

- 2-2 : `updateElement` 함수에서 실제 DOM(`container.firstChild`)을 사용하는 문제
  - `updateElement` 함수가 기존 구조를 제대로 이해하지 못하고 불필요한 전체 렌더링을 수행할 가능성이 크다.

<br/>

- 해결 과정 :

- 2-1 : **이전 가상 DOM을 저장하는 구조를 추가**하여, **이전 가상 DOM과 새로운 가상 DOM을 비교**할 수 있도록 한다. (diff 알고리즘 적용)

```js
// 📝 이전 vNode를 저장하는 WeakMap (container 기준으로 저장)
const oldVNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 1️⃣ 이전 vNode 가져오기
  const oldVNode = oldVNodeMap.get(container);

  // 2️⃣ 새로운 vNode 정규화
  const newVNode = normalizeVNode(vNode);

  // 3️⃣ 이전 vNode가 없으면 새로 생성
  if (!oldVNode) {
    const newElement = createElement(newVNode);
    container.appendChild(newElement);
  } else {
    // 4️⃣ 이전 vNode가 있으면 diff 알고리즘을 적용하여 변경된 부분만 업데이트
    updateElement(container, newVNode, oldVNode);
  }

  // 5️⃣ 새로운 vNode 저장
  oldVNodeMap.set(container, newVNode);

  setupEventListeners(container);
}
```

이전 vNode를 저장하는 `WeakMap`을 이용하여, 이전 vNode를 저장하고 새로운 가상 DOM과 비교할 수 있도록 한다.

`WeakMap`은 키로 사용된 객체가 존재하지 않을 경우 자동으로 메모리에서 제거되기 때문에, 메모리 누수를 방지할 수 있다.

`container`를 키로 사용하여, 이전에 렌더링한 `가상 DOM(vNode)`을 저장하는 구조를 만든다.

```js
else {
  updateElement(container, newVNode, oldVNode);
}
```

`updateElement()`가 실행될 때, **이전 vNode와 새로운 vNode를 비교하여 변경된 부분만 업데이트**한다.

```js
// 이전 vNode 저장
oldVNodeMap.set(container, newVNode);
```

현재 상태(vNode)를 `WeakMap`에 저장하여, 다음 렌더링에서 diff 비교가 가능하도록 설정한다.

![](https://velog.velcdn.com/images/ninto_2/post/d0374323-d0f1-49fe-ba53-d3f6af03c06f/image.png)

결과적으로 전체 DOM을 다시 그리지 않고, 효율적으로 변경 사항만 반영할 수 있게된다.

<br/>

---

<br/>

> 3. DOM 업데이트시 이벤트 핸들러 참조 문제 해결

- 문제 발생 : 새로운 포스트 생성 후, 새 포스트에 좋아요를 클릭하면 이전 포스트의 좋아요에 이벤트가 적용되는 문제가 발생했다.

![](https://velog.velcdn.com/images/ninto_2/post/e5f9e782-a5b4-423e-8e41-3ce33308c01b/image.png)

```js
// Post.jsx
export const Post = ({
  id,
  author,
  time,
  content,
  likeUsers,
  activationLike = false,
}) => {
// Post 컴포넌트에서 인자로 전달받는 새로운 포스트의 id 값은 6

...

  const handleLikeClick = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");
      return;
    }
    toggleLike(id); // 전달되는 id가 1 로 변경되는 문제 발생
  };

  ...

  onClick={handleLikeClick} //  onClick 이벤트 핸들러에 전달되는 id가 1 로 변경되는 문제 발생
```

<br/>

- 원인 분석 :

```js
// 기존 updateAttributes 함수
function updateAttributes(target, newProps = {}, oldProps = {}) {
  for (const [key, newValue] of Object.entries(newProps)) {
    if (newValue === oldProps[key]) continue;

    if (typeof newValue === "function") {
      addEvent(target, key.toLowerCase().substring(2), newValue);
      continue;
    }

    if (key === "className") {
      target.className = newValue;
      continue;
    }

    if (key in target) {
      target[key] = newValue;
      continue;
    }

    if (newValue != null && newValue !== false) {
      target.setAttribute(key, newValue);
    }
  }

  for (const key in oldProps) {
    if (key in newProps) continue;

    if (typeof oldProps[key] === "function") {
      removeEvent(target, key.toLowerCase().substring(2), oldProps[key]);
      continue;
    }

    if (key === "className") {
      target.className = "";
      continue;
    }

    if (key in target) {
      target[key] = "";
      continue;
    }

    target.removeAttribute(key);
  }
}
```

- 3-1 : `updateAttributes` 내부에서 `addEvent` 를 실행할 때 **이전 핸들러를 제거하지 않고 그대로 새로운 핸들러를 추가**하는 문제가 있다. (이벤트 핸들러가 중복 등록되는 문제)

  - 이전 포스트의 좋아요 버튼이 여전히 기존 핸들러를 참조하고 있어서, 새 포스트에서 버튼을 클릭해도 이전 포스트에도 영향을 미칠 수 있다.
  - `updateAttributes` 함수가 불필요한 이벤트 등록을 방지하면서도, 변경된 이벤트만 업데이트 할 수 있도록 해야한다.
  - `updateElement` 함수에서 `updateAttributes` 함수를 호출할 때, `currentElement, newNode.props, oldNode.props`를 제대로 전달하는지 확인이 필요하다.

<br/>

- 해결 과정 :

- 3-1 : `updateAttributes` 함수를 호출할 때, `newNode.props` 와 `oldNode.props`에 nullish 병합 연산자 추가

```js
// updateElement 함수 내부
updateAttributes(currentElement, newNode.props ?? {}, oldNode.props ?? {});
```

nullish 병합 연산자를 사용하여, `newNode.props` 와 `oldNode.props`가 null 이나 undefined 일 경우 빈 객체를 전달하여 안정성을 높인다.

- 3-2 : `updateAttributes` 함수에서 기존 이벤트 핸들러를 제거할 수 있도록 로직을 추가

```js
// updateAttributes 함수 내부
// 1️⃣ 기존 이벤트 핸들러 제거 로직 추가
for (const key in oldProps) {
  if (typeof oldProps[key] === "function" && key.startsWith("on")) {
    const eventType = key.toLowerCase().substring(2);

    // 새로운 Props에 이벤트가 없거나, 함수가 변경되었다면 제거
    if (!(key in newProps) || newProps[key] !== oldProps[key]) {
      removeEvent(target, eventType, oldProps[key]);
    }
  }
}

...

```

![](https://velog.velcdn.com/images/ninto_2/post/796f2c36-5591-47fd-af2f-b9ad0b95c1bc/image.png)

결과적으로, **이벤트 핸들러가 중복 등록되지 않도록 기존 핸들러를 올바르게 정리**하는 로직을 추가하여 이전 핸들러가 남아 발생하는 **참조 오류를 해결**할 수 있었다.

<br/>

---

<br/>

### 코드 품질

<!-- 예시
- 특히 만족스러운 구현
- 리팩토링이 필요한 부분
- 코드 설계 관련 고민과 결정
-->

> ✅ 만족스러운 구현 셀프 체크 : WeakMap과 diff 알고리즘을 활용한 가상 DOM 적용으로 렌더링 최적화

#### 🚀 개선 전 문제점:

기존 `renderElement` 함수에서는 **이전 가상 DOM(vNode)**의 상태를 저장하지 않아 매번 전체 DOM을 다시 렌더링해야 했습니다.
이는 불필요한 성능 저하를 초래했으며, diff 알고리즘을 적용하기 어려운 구조였습니다.

```js
// 기존 renderElement 함수
export function renderElement(vNode, container) {
  // 새로운 vNode를 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 기존 DOM이 없으면 새로 생성
  if (!container.firstChild) {
    const newElement = createElement(normalizedVNode);
    container.appendChild(newElement);
  } else {
    // 기존 DOM이 있으면 업데이트 (문제 발생)
    updateElement(container, normalizedVNode, container.firstChild);
  }
}
```

#### ❌ 기존 코드의 문제점 :

- `updateElement(container, normalizedVNode, container.firstChild);` → **이전 가상 DOM 대신 실제 DOM(container.firstChild)을 비교 대상으로 사용하여** 가상 DOM 기반의 효율적인 diffing을 방해함.

- 이전 상태를 저장하는 구조가 없어, **항상 전체 DOM을 다시 렌더링**해야 함.

- **불필요한 DOM 변경이 많아지고, 성능 저하 발생 가능성 증가.**

<br/>

#### ✅ 개선 후: WeakMap을 활용한 가상 DOM 적용

- `WeakMap`을 활용하여 **이전 vNode를 저장하고, diff 알고리즘을 적용할 수 있도록 개선**하였습니다.

```js
// 📝 이전 vNode를 저장하는 WeakMap (container를 키로 사용)
const oldVNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 1️⃣ 이전 vNode 가져오기
  const oldVNode = oldVNodeMap.get(container);

  // 2️⃣ 새로운 vNode 정규화
  const newVNode = normalizeVNode(vNode);

  // 3️⃣ 이전 vNode가 없으면 새로 생성
  if (!oldVNode) {
    const newElement = createElement(newVNode);
    container.appendChild(newElement);
  } else {
    // 4️⃣ 이전 vNode가 있으면 updateElement에서 diff 처리 → 변경된 부분만 DOM 반영
    updateElement(container, newVNode, oldVNode);
  }

  // 5️⃣ 새로운 vNode 저장
  oldVNodeMap.set(container, newVNode);
}
```

#### 🔍 개선된 점과 코드 품질 향상 포인트

- 이전 가상 DOM(vNode) 저장을 통한 렌더링 개선

  - `WeakMap`을 활용하여 이전 가상 DOM을 저장하고, 이전 가상 DOM과 새로운 가상 DOM을 비교하여 변경된 부분만 업데이트 가능하도록 코드를 개선하였습니다.

  - 결과적으로, **불필요한 DOM 변경을 최소화**하여 렌더링 성능을 향상시킬 수 있었습니다.

#### 🔍 `WeakMap` 사용 이유

- `WeakMap`은 키로 사용된 객체가 참조되지 않으면 자동으로 가비지 컬렉션(GC) 되므로 불필요한 메모리 점유를 방지할 수 있음.

-`일반 객체(Map)`를 사용할 경우, 명시적으로 삭제하지 않으면 불필요한 데이터가 계속 남아 메모리 누수를 유발할 가능성이 있음.

✅ `WeakMap` 사용 결과:

이전 vNode를 안전하게 저장하면서도, 필요 없는 데이터는 자동으로 정리됨

메모리 관리가 효율적으로 이루어져, 렌더링 성능이 최적화됨

#### 📋 개선 포인트 비교

| 개선 포인트        | 기존 코드                  | 개선 후 (WeakMap 적용)                               |
| ------------------ | -------------------------- | ---------------------------------------------------- |
| **이전 상태 저장** | ❌ 없음                    | ✅ `WeakMap`을 사용하여 저장                         |
| **렌더링 방식**    | 전체 DOM 다시 그림         | 변경된 부분만 업데이트                               |
| **비교 대상**      | 새로운 vNode vs 실제 DOM   | 새로운 vNode vs 이전 vNode (diff 알고리즘 적용 가능) |
| **메모리 관리**    | 필요 없는 데이터 유지 가능 | ✅ GC 자동 관리 (메모리 누수 방지)                   |
| **성능 최적화**    | 불필요한 렌더링 많음       | ✅ 최소한의 DOM 업데이트 적용                        |

<br/>

---

<br/>

### 학습 효과 분석

<!-- 예시
- 가장 큰 배움이 있었던 부분
- 추가 학습이 필요한 영역
- 실무 적용 가능성
-->

- ✅ SPA 라우팅에 대한 이해와 GitHub Pages 배포 경험

- ✅ 가상 DOM 개념 이해와 이를 활용한 렌더링 최적화 방법 습득

<br/>

## 리뷰 받고 싶은 내용

<!--
피드백 받고 싶은 내용을 구체적으로 남겨주세요
모호한 요청은 피드백을 남기기 어렵습니다.

참고링크: https://chatgpt.com/share/675b6129-515c-8001-ba72-39d0fa4c7b62

모호한 요청의 예시)
- 코드 스타일에 대한 피드백 부탁드립니다.
- 코드 구조에 대한 피드백 부탁드립니다.
- 개념적인 오류에 대한 피드백 부탁드립니다.
- 추가 구현이 필요한 부분에 대한 피드백 부탁드립니다.

구체적인 요청의 예시)
- 현재 함수와 변수명을 보면 직관성이 떨어지는 것 같습니다. 함수와 변수를 더 명확하게 이름 지을 수 있는 방법에 대해 조언해주실 수 있나요?
- 현재 파일 단위로 코드가 분리되어 있지만, 모듈화나 계층화가 부족한 것 같습니다. 어떤 기준으로 클래스를 분리하거나 모듈화를 진행하면 유지보수에 도움이 될까요?
- MVC 패턴을 따르려고 했는데, 제가 구현한 구조가 MVC 원칙에 맞게 잘 구성되었는지 검토해주시고, 보완할 부분을 제안해주실 수 있을까요?
- 컴포넌트 간의 의존성이 높아져서 테스트하기 어려운 상황입니다. 의존성을 낮추고 테스트 가능성을 높이는 구조 개선 방안이 있을까요?
-->

1. Diff 알고리즘이 적용되었는지 여부

현재 updateElement.js에서 기존 노드(oldNode)와 새로운 노드(newNode)를 비교하여 업데이트를 수행하고 있습니다.
하지만, 이 방식이 과제에서 요구한 Diff 알고리즘을 제대로 반영하여 변경된 부분만 업데이트하는 구조인지 확신이 서지 않습니다.
혹시 개선할 부분이 있을까요?

2. 트러블 슈팅과정에서 제가 기술적으로 잘못 이해를 하고 접근한 부분이 있는지 검토 부탁드립니다..!
