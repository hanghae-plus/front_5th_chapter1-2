/**
 * @file eventManager.js
 * @description
 * DOM 요소에 이벤트를 직접 등록하지 않고,
 * 이벤트 위임(delegation)을 활용하여 효율적으로 이벤트를 관리하는 유틸리티 모듈입니다.
 *
 * ✅ 주요 특징
 * - 루트 요소(root)에만 이벤트 리스너를 등록하고, 자식 요소에 발생한 이벤트를 위임 방식으로 처리합니다.
 * - 개별 요소마다 이벤트 리스너를 붙이지 않아도 되므로 성능 및 메모리 측면에서 효율적입니다.
 * - 핸들러는 내부 저장소(eventStore)에 기록되며, 실제 실행은 루트의 리스너에서 일어납니다.
 *
 * ✅ 포함된 기능
 * - `addEvent(element, eventType, handler)`
 *   : 이벤트 핸들러를 내부 저장소에 등록합니다. DOM에는 직접 리스너를 달지 않습니다.
 *
 * - `setupEventListeners(root)`
 *   : 루트 요소에 실제 이벤트 리스너를 한 번만 등록합니다. 이후 위임 방식으로 이벤트를 처리합니다.
 *
 * - `removeEvent(element, eventType, handler)`
 *   : 저장된 이벤트 핸들러를 제거합니다. 핸들러가 모두 제거되면 해당 요소의 이벤트도 제거됩니다.
 *
 * ✅ 사용 예시
 * ```js
 * const container = document.getElementById("root");
 * const button = document.createElement("button");
 *
 * addEvent(button, "click", () => console.log("clicked!"));
 * container.appendChild(button);
 *
 * setupEventListeners(container); // 반드시 한 번만 호출
 * ```
 *
 * ✅ 이벤트 위임을 사용하는 이유
 * - 이벤트 리스너를 수백 개 붙이는 비용을 줄이기 위해
 * - 메모리 누수 방지 및 성능 최적화를 위해
 * - 컴포넌트가 자주 생성/제거되는 환경(예: SPA)에서 정리하기 쉬움
 */

// "요소에 특정 이벤트가 발생했을 때 어떤 함수를 실행시켜라"
// 라는 요청을 받아서,
// 📦 내부 저장소에 그 정보를 기록하는 함수야.
const eventStore = new Map(); // 내부 이벤트 저장소 만들기 구조: element → { click: [handler1, handler2], input: [...] }
const supportedEvents = ["click", "mouseover", "focus", "keydown", "submit"]; // 현재 챕터에서 사용하고 있는 이벤트들, 만약 여기서 이벤트 말고 다른 이벤트들을 사용한다면 해당 배열에 추가해야함

/**
 * 이벤트 리스너 설정
 * ✅ root 요소 하나에만 이벤트 리스너를 붙이고,
 *❗ 자식 요소들이 클릭되었을 때 누구를 눌렀는지 추적해서
 * 👉 addEvent()로 등록한 핸들러를 실행함!
 * @param {*} root // 루트 엘리먼트
 * @description 이벤트 위임을 사용하여 루트 엘리먼트에 클릭 이벤트 리스너를 설정합니다.
 * 이벤트가 발생하면 가장 가까운 상위 요소에서 해당 이벤트를 찾아 실행합니다.
 **/
export function setupEventListeners(root) {
  //1. 루트에 클릭 리스너 등록
  supportedEvents.forEach((type) => {
    root.addEventListener(type, (e) => {
      // 2. 이벤트 발생한 타겟 가져오기
      let target = e.target;
      //  3. 이벤트 전파 따라 위로 올라가며 탐색
      while (target && target !== root) {
        //4 . 해당 요소에 등록된 이벤트 핸들러 찾기
        const events = eventStore.get(target);
        const handlers = events?.[type];

        // 5. 핸들러 실행
        if (handlers?.length) {
          handlers.slice().forEach((fn) => fn(e));
          break; // 가장 가까운 한 요소만 실행 (React 스타일) 딱 한 번만 실행되게 함
        }

        // 6. 다음 부모로 타겟 이동
        target = target.parentNode;
      }
    });
  });
}

/**
 * 이벤트 리스너 추가
 * @param {*} element // 이벤트를 추가할 엘리먼트
 * @param {*} eventType // 추가할 이벤트 타입 (예: 'click', 'input')
 * @param {*} handler // 추가할 핸들러 함수
 * @returns
 * @description 이 함수는 이벤트 위임 시스템의 기반을 만드는 함수
 * 요소(element)에 특정 이벤트(eventType)가 발생하면 이 함수(handler)를 나중에 실행
 * 이벤트 핸들러를 element에 추가합니다. 이벤트 타입에 따라 핸들러를 저장합니다.
 * 이벤트가 발생하면 해당 핸들러가 실행됩니다.
 * 이벤트 위임을 사용하여 루트 엘리먼트에 클릭 이벤트 리스너를 설정합니다.
 */
export function addEvent(element, eventType, handler) {
  // console.log(element, eventType, handler);
  // 1. 해당 element에 대한 이벤트 저장 객체가 없으면 새로 만들기
  if (!eventStore.has(element)) {
    eventStore.set(element, {});
  }

  // 2. 해당 element의 이벤트 목록 꺼내오기
  const events = eventStore.get(element);

  // 3. 특정 이벤트 타입(click 등)의 핸들러 배열이 없으면 만들기
  if (!events[eventType]) {
    events[eventType] = [];
  }

  // 4. 핸들러 추가
  events[eventType].push(handler);
}

/**
 * 이벤트 리스너 제거 - removeEvent() 함수는 addEvent()로 등록해둔 이벤트 핸들러를 제거하는 함수
 * 이벤트 리스너 제거 이유
 * 1. ❗ 메모리 누수 방지 (Memory Leak)
 * DOM 요소가 사라졌는데도 리스너가 남아있으면?
 * JavaScript는 그 리스너 때문에 그 요소를 계속 메모리에 붙잡고 있음
 * → 브라우저 성능 저하, 느려짐, 누적되면 앱이 터짐 💥
 * 2. 😵 불필요한 함수 실행 방지
 * click 할 때마다 예전 핸들러까지 중복으로 실행될 수 있음
 * 3. 🧼 정리 안 하면 디버깅 지옥
 * 4. ✅ 리액트, 뷰, 스벨트 등 프레임워크도 내부에서 항상 제거함!
 * @param {*} element // 이벤트를 제거할 엘리먼트
 * @param {*} eventType // 제거할 이벤트 타입 (예: 'click', 'input')
 * @param {*} handler // 제거할 핸들러 함수
 * @returns
 */
export function removeEvent(element, eventType, handler) {
  // 1. 해당 요소의 이벤트 목록 가져오기 -> ✅ 즉, "없으면 안 건드림"
  const events = eventStore.get(element);
  if (!events || !events[eventType]) return;

  // 2. 해당 핸들러만 필터링
  events[eventType] = events[eventType].filter(
    (/** @type {any} */ fn) => fn !== handler,
  );

  // 더 이상 등록된 핸들러가 없다면 정리
  if (events[eventType].length === 0) {
    delete events[eventType];
  }

  // 해당 element에 어떤 이벤트도 없다면 전체 제거
  if (Object.keys(events).length === 0) {
    eventStore.delete(element);
  }
}
