// 전역 객체로 이벤트 저장
const eventStorage = new Map();

// 특정 요소에 이벤트 저장
export function addEvent(element, eventType, handler) {
  if (!element || typeof handler !== "function") return;
  if (!eventStorage.has(eventType)) {
    eventStorage.set(eventType, new WeakMap());
  }

  eventStorage.get(eventType).set(element, handler);
}

// 특정 요소에서 이벤트 제거
export function removeEvent(element, eventType, handler) {
  const handlers = eventStorage.get(eventType);

  if (handlers && handlers.get(element) === handler) {
    handlers.delete(element);
  }
}

// 이벤트 위임 처리
export function setupEventListeners(root) {
  for (const eventType of eventStorage.keys()) {
    root.removeEventListener(eventType, handleEvents);
    root.addEventListener(eventType, handleEvents);
  }
}

// 이벤트 전파 처리
export function handleEvents(e) {
  const handlers = eventStorage.get(e.type);

  if (handlers && handlers.has(e.target)) {
    handlers.get(e.target)(e);
  }
}
