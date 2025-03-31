// 중앙 저장소: 이벤트 핸들러 정보 저장
const handlers = new Map();

export function setupEventListeners(root) {
  // 모든 등록된 이벤트 타입을 처리할 단일 리스너 설정
  handlers.forEach((elements, eventType) => {
    root.addEventListener(eventType, (event) => {
      const target = event.target;

      const eventElements = elements;

      eventElements.forEach((handlersArray, element) => {
        if (
          target === element ||
          element.contains(target) ||
          target.contains(element)
        ) {
          handlersArray.forEach((handler) => {
            handler(event);
          });
        }
      });
    });
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

  eventElements.get(element).push(handler);
}

export function removeEvent(element, eventType, handler) {
  console.log(element, eventType, handler);

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
