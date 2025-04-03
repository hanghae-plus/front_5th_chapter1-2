// 이벤트 핸들러 맵 (전역 상태 관리)
const eventHandlers = new Map();

/**
 * 이벤트 발생 시 실행되는 핸들러
 */
function handleEvent(event) {
  const target = event.target;

  if (eventHandlers.has(target) && eventHandlers.get(target).has(event.type)) {
    const handlers = eventHandlers.get(target).get(event.type);
    handlers.forEach((handler) => handler(event));
  }
}

/**
 * 등록된 모든 이벤트 타입을 가져오는 함수
 */
export function getRegisteredEventTypes() {
  const eventTypes = {};

  for (const [, elementHandlers] of eventHandlers) {
    for (const eventType of elementHandlers.keys()) {
      eventTypes[eventType] = true;
    }
  }

  return Object.keys(eventTypes);
}

/**
 * 이벤트 위임 설정
 */
export function setupEventListeners(root) {
  const eventTypes = getRegisteredEventTypes();
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

/**
 * 요소에 이벤트 핸들러 추가
 */
export function addEvent(element, eventType, handler) {
  // 요소에 대한 이벤트 맵이 없으면 생성
  if (!eventHandlers.has(element)) {
    eventHandlers.set(element, new Map());
  }

  // 이벤트 타입에 대한 핸들러 배열이 없으면 생성
  const elementHandlers = eventHandlers.get(element);
  if (!elementHandlers.has(eventType)) {
    elementHandlers.set(eventType, []);
  }

  // 핸들러 추가
  elementHandlers.get(eventType).push(handler);
}

/**
 * 요소에서 이벤트 핸들러 제거
 */
export function removeEvent(element, eventType, handler) {
  if (!eventHandlers.has(element)) return;

  const elementHandlers = eventHandlers.get(element);
  if (!elementHandlers.has(eventType)) return;

  const handlers = elementHandlers.get(eventType);
  const index = handlers.indexOf(handler);

  if (index !== -1) {
    handlers.splice(index, 1);

    // 핸들러 배열이 비었으면 이벤트 타입 제거
    if (handlers.length === 0) {
      elementHandlers.delete(eventType);

      // 요소에 등록된 이벤트가 없으면 요소 제거
      if (elementHandlers.size === 0) {
        eventHandlers.delete(element);
      }
    }
  }
}

/**
 * 요소에 등록된 모든 이벤트 핸들러 제거
 */
export function removeAllEvents(element) {
  if (eventHandlers.has(element)) {
    const elementHandlers = eventHandlers.get(element);
    elementHandlers.clear();
    eventHandlers.delete(element);
  }
}
