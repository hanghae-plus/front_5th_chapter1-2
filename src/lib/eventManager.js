/**
 * globalEvents
 * {
 *   click: WeakMap {
 *     element1: handler1,
 *     element2: handler2,
 *     ...
 *   },
 *   input: WeakMap {
 *     element3: handler3,
 *     ...
 *   }
 * }
 */

let globalEvents = {};

// 콜백으로 넣으면 add할때의 remove할때의 콜백이 다를 수 있음
/**
 *
 * @param {HTMLElement} root
 */
export function setupEventListeners(root) {
  for (const eventType in globalEvents) {
    // 이벤트 리스너 중복 등록이 방지
    root.addEventListener(eventType, handleGlobalEvents);
  }
}

export function handleGlobalEvents(e) {
  let target = e.target;
  // 버블링을 이용하여 부모 요소까지 탐색하며 해당 이벤트 타입(e.type)에 대해 등록된 핸들러가 있는지 확인
  while (target) {
    if (globalEvents[e.type].has(target)) {
      // 등록된 핸들러 실행
      globalEvents[e.type].get(target)(e);
    }
    target = target.parentElement;
  }
}

export function addEvent(element, eventType, handler) {
  if (!element || typeof handler !== "function") return;

  // 이미 존재하는 이벤트 타입(eventType)이면 기존 WeakMap을 사용하고, 없으면 새로운 WeakMap을 생성
  globalEvents[eventType] = globalEvents[eventType] || new WeakMap();
  globalEvents[eventType].set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  if (globalEvents[eventType].get(element) === handler) {
    globalEvents[eventType].delete(element);
  }
}
