// root에 등록해둔 이벤트 타입을 Set+Map으로 관리
const rootMap = new Map();
const eventTypeMap = new Map();

export function setupEventListeners(root) {
  if (!rootMap.has(root)) {
    rootMap.set(root, new Set());
  }

  // root에 연결되어 있는 이벤트 타입들
  const pastEvents = rootMap.get(root);

  eventTypeMap.forEach((typeEvents, eventType) => {
    // 이벤트 타입이 root에 등록되어 있다면 리턴
    if (pastEvents.has(eventType)) {
      return;
    }

    // 이벤트 타입이 root에 등록되어 있지 않다면 이벤트 리스너 등록
    root.addEventListener(eventType, (event) => {
      const target = event.target;
      // 이벤트가 발생한 target의 handler가 Map에 있다면
      if (typeEvents.has(target)) {
        const handler = typeEvents.get(target);
        handler(event);
      }
    });
    pastEvents.add(eventType);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventTypeMap.has(eventType)) {
    eventTypeMap.set(eventType, new Map());
  }
  const typeEvents = eventTypeMap.get(eventType);
  typeEvents.set(element, handler);
}

export function removeEvent(element, eventType) {
  if (eventTypeMap.has(eventType)) {
    const typeEvents = eventTypeMap.get(eventType);
    if (typeEvents.has(element)) {
      typeEvents.delete(element);
    }
  }
}
