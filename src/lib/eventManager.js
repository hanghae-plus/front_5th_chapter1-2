// 등록해둔 이벤트 타입을 Map[root, Set[eventType]] 으로 관리
const rootEventMap = new Map();
const eventTypeMap = new Map();

export function setupEventListeners(root) {
  // root에 등록할 eventType 집합 초기화
  if (!rootEventMap.has(root)) {
    rootEventMap.set(root, new Set());
  }

  // root에 연결되어 있는 이벤트 타입들
  const rootEvents = rootEventMap.get(root);

  eventTypeMap.forEach((typeEvents, eventType) => {
    // 이벤트 타입이 root에 등록되어 있다면 리턴
    if (rootEvents.has(eventType)) return;

    // 이벤트 타입을 root에 등록
    rootEvents.add(eventType);

    // 이벤트 타입이 root에 등록되어 있지 않다면 이벤트 리스너 등록
    // 'typeEvents를 순회해서, 실행해야 하는 핸들러 있으면 실행한다' 라는 이벤트를 부착
    root.addEventListener(eventType, (event) => {
      const target = event.target;
      // 이벤트가 발생한 target의 handler가 Map에 있다면 수행
      if (typeEvents.has(target)) {
        const handler = typeEvents.get(target);
        handler(event);
      }
    });
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
