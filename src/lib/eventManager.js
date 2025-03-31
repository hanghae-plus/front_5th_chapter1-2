const handlers = new Map();
const rootListeners = new Map();

export function setupEventListeners(root) {
  // 이미 등록된 이벤트 유형은 다시 등록하지 않음
  handlers.forEach((elements, eventType) => {
    if (!rootListeners.has(root)) {
      rootListeners.set(root, new Set());
    }

    const rootEvents = rootListeners.get(root);

    if (!rootEvents.has(eventType)) {
      const listener = (event) => {
        const target = event.target;
        const eventElements = handlers.get(eventType);

        if (!eventElements) return;

        eventElements.forEach((handlersArray, element) => {
          if (
            target === element ||
            element.contains(target) ||
            target.contains(element)
          ) {
            [...handlersArray].forEach((handler) => {
              handler(event);
            });
          }
        });
      };

      root.addEventListener(eventType, listener);
      rootEvents.add(eventType);
    }
  });
}

export function addEvent(element, eventType, handler) {
  if (!handlers.has(eventType)) {
    handlers.set(eventType, new Map());
  }

  const eventElements = handlers.get(eventType);

  if (!eventElements.has(element)) {
    eventElements.set(element, []);
  }

  // 중복 등록 방지
  const elementHandlers = eventElements.get(element);
  if (!elementHandlers.includes(handler)) {
    elementHandlers.push(handler);
  }
}

export function removeEvent(element, eventType, handler) {
  if (!handlers.has(eventType)) {
    return;
  }

  const eventElements = handlers.get(eventType);

  if (!eventElements.has(element)) {
    return;
  }

  const elementHandlers = eventElements.get(element);
  const index = elementHandlers.indexOf(handler);

  if (index !== -1) {
    elementHandlers.splice(index, 1);

    if (elementHandlers.length === 0) {
      eventElements.delete(element);
    }

    if (eventElements.size === 0) {
      handlers.delete(eventType);
    }
  }
}

// 테스트 용도로 핸들러 상태 초기화 추가
export function clearAllHandlers() {
  handlers.clear();
  rootListeners.clear();
}
