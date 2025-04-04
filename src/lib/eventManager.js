const eventStore = new Map(); // 각 요소에 대한 이벤트 핸들러를 저장할 맵
const eventTypeListeners = new Map(); // 이벤트 타입에 대한 리스너 저장

export function setupEventListeners(root) {
  const handleEvent = (e) => {
    const elementEvents = eventStore.get(e.target);
    if (elementEvents) {
      const handler = elementEvents.get(e.type);
      if (handler) {
        handler.call(e.target, e);
      }
    }
  };

  // 루트에 리스너를 추가하기 전에, 이미 리스너가 등록되어 있는지 확인
  eventTypeListeners.forEach((listeners, eventType) => {
    if (!listeners.has(root)) {
      root.addEventListener(eventType, handleEvent);
      listeners.set(root, handleEvent);
    }
  });

  // 클린업: 특정 root에 대한 리스너만 제거
  return () => {
    eventTypeListeners.forEach((listeners, eventType) => {
      if (listeners.has(root)) {
        root.removeEventListener(eventType, handleEvent);
        listeners.delete(root);
      }
    });
  };
}

export function addEvent(element, eventType, handler) {
  // 요소가 없으면 새로 추가
  if (!eventStore.has(element)) {
    eventStore.set(element, new Map());
  }

  const elementEvents = eventStore.get(element);

  // 이벤트 타입이 이미 존재하면 추가하지 않음
  if (elementEvents.has(eventType)) {
    return;
  }

  elementEvents.set(eventType, handler);

  // eventTypeListeners에 해당 eventType이 없으면 새로 생성
  if (!eventTypeListeners.has(eventType)) {
    eventTypeListeners.set(eventType, new Map());
  }

  const listeners = eventTypeListeners.get(eventType);
  listeners.set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  // element가 없으면 종료
  const elementEvents = eventStore.get(element);
  if (!elementEvents || elementEvents.get(eventType) !== handler) return;

  // 해당 이벤트 핸들러 삭제
  elementEvents.delete(eventType);

  const listeners = eventTypeListeners.get(eventType);
  listeners.delete(element);

  // 만약 해당 eventType에 대한 listener가 없으면 eventTypeListeners에서 제거
  if (listeners.size === 0) {
    eventTypeListeners.delete(eventType);
  }

  // 해당 element에 대한 이벤트가 모두 삭제되면 elementEvents 삭제
  if (elementEvents.size === 0) {
    eventStore.delete(element);
  }
}
