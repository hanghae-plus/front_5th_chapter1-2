/**
 * 이벤트 리스너를 저장하는 맵
 * 구조: { element: { eventType: { listener: handler } } }
 */
const eventListeners = new Map();

/**
 * 이벤트 핸들러를 실행하는 함수
 * 이벤트 위임(delegation) 방식으로 동작
 * @param {Event} event - 브라우저 이벤트 객체
 */
function handleEvent(event) {
  const elementListeners = eventListeners.get(this);
  if (!elementListeners) return;

  const handlers = elementListeners[event.type];
  if (!handlers) return;

  // 모든 등록된 핸들러 실행
  Object.values(handlers).forEach((handler) => handler(event));
}

/**
 * 컨테이너에 이벤트 리스너 설정
 * @param {HTMLElement} root - 이벤트를 위임할 루트 요소
 */
export function setupEventListeners(root) {
  console.log("root", root);
  if (!root || root._hasEventSetup) return;

  // 등록된 모든 이벤트 타입에 대해 리스너 설정
  const elementListeners = eventListeners.get(root);
  if (elementListeners) {
    Object.keys(elementListeners).forEach((eventType) => {
      root.addEventListener(eventType, handleEvent);
    });
  }

  // 이벤트 설정 완료 표시
  root._hasEventSetup = true;
}

/**
 * 요소에 이벤트 핸들러 추가
 * @param {HTMLElement} element - 이벤트를 등록할 요소
 * @param {String} eventType - 이벤트 타입 (click, input 등)
 * @param {Function} handler - 이벤트 핸들러 함수
 */
export function addEvent(element, eventType, handler) {
  if (!element || !eventType || !handler) return;

  // 요소의 이벤트 맵 초기화
  if (!eventListeners.has(element)) {
    eventListeners.set(element, {});
  }

  const elementListeners = eventListeners.get(element);

  // 이벤트 타입 맵 초기화
  if (!elementListeners[eventType]) {
    elementListeners[eventType] = {};
  }

  // 핸들러 추가 (동일 핸들러 중복 방지를 위해 객체 속성으로 저장)
  elementListeners[eventType][handler] = handler;

  // 부모 요소(컨테이너)에 이벤트 리스너 설정
  let parent = element.parentElement;
  while (parent) {
    if (parent._hasEventSetup) break;
    parent = parent.parentElement;
  }

  // 부모 요소에 이벤트 리스너가 없으면 현재 요소에 직접 리스너 추가
  if (!parent) {
    element.addEventListener(eventType, handler);
  }
}

/**
 * 요소에서 이벤트 핸들러 제거
 * @param {HTMLElement} element - 이벤트를 제거할 요소
 * @param {String} eventType - 이벤트 타입 (click, input 등)
 * @param {Function} handler - 제거할 이벤트 핸들러 함수
 */
export function removeEvent(element, eventType, handler) {
  if (!element || !eventType || !handler) return;

  // 요소에 등록된 이벤트 맵 확인
  const elementListeners = eventListeners.get(element);
  if (!elementListeners || !elementListeners[eventType]) return;

  // 핸들러 제거
  delete elementListeners[eventType][handler];

  // 이벤트 타입에 핸들러가 없으면 이벤트 타입 객체 제거
  if (Object.keys(elementListeners[eventType]).length === 0) {
    delete elementListeners[eventType];
  }

  // 요소에 등록된 이벤트가 없으면 요소 제거
  if (Object.keys(elementListeners).length === 0) {
    eventListeners.delete(element);
  }

  // 직접 등록된 이벤트 리스너가 있었다면 제거
  element.removeEventListener(eventType, handler);
}
