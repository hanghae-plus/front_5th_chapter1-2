const globalEvents = new Map();

// 렌더링이 끝나면 전역 이벤트를 등록해줌
export function setupEventListeners(root) {
  for (const eventType of globalEvents.keys()) {
    root.removeEventListener(eventType, handleGlobalEvents);
    root.addEventListener(eventType, handleGlobalEvents);
  }
}

export function handleGlobalEvents(e) {
  const typeMap = globalEvents.get(e.type);
  if (typeMap && typeMap.has(e.target)) {
    const handler = typeMap.get(e.target);
    handler?.(e);
  }
}

// 이벤트를 전역 객체에 넣어주는 함수...createElement에서 쓰고 있음
export function addEvent(element, eventType, handler) {
  if (!element || typeof handler !== "function") return;

  if (!globalEvents.has(eventType)) {
    globalEvents.set(eventType, new WeakMap());
  }

  globalEvents.get(eventType).set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  const typeMap = globalEvents.get(eventType);
  if (typeMap && typeMap.get(element) === handler) {
    typeMap.delete(element);
  }
}
