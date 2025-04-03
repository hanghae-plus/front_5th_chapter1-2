// 이벤트 핸들러 저장
const eventHandlers = new WeakMap();

// 처리할 이벤트 타입 목록
const EVENT_TYPES = ["click", "mouseover", "focus", "keydown", "submit"];

export function setupEventListeners(root) {
  // 이미 이벤트 리스너가 등록되어 있는지 확인
  if (eventHandlers.has(root)) {
    return;
  }

  // 각 이벤트 타입에 대해 리스너 등록
  EVENT_TYPES.forEach((eventType) => {
    root.addEventListener(eventType, (e) => {
      const target = e.target;
      const handlers = eventHandlers.get(target);

      if (handlers && handlers[eventType]) {
        handlers[eventType](e);
      }
    });
  });

  // 이벤트 리스너 등록 완료 표시
  eventHandlers.set(root, { isSetup: true });
}

export function addEvent(element, eventType, handler) {
  // 이벤트 핸들러 저장
  const handlers = eventHandlers.get(element) || {};

  handlers[eventType] = handler;
  eventHandlers.set(element, handlers);
}

export function removeEvent(element, eventType) {
  // 이벤트 핸들러 제거
  const handlers = eventHandlers.get(element);

  if (!handlers) {
    return;
  }

  delete handlers[eventType];

  if (Object.keys(handlers).length === 0) {
    eventHandlers.delete(element);
  }
}
