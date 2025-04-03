// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.

// addEvent가 등록되고, setupEventListeners로 root에 이벤트 위임한다

// 모든 이벤트 리스너를 저장할 전역 Map
const eventListeners = new Map();

export function setupEventListeners(root) {
  // Map에 저장된 모든 이벤트를 순회
  for (const [element, handlers] of eventListeners.entries()) {
    for (const [eventType, handler] of handlers.entries()) {
      // onClick -> click 형태로 변환
      // console.log(eventType);
      const normalizedEventType = eventType.startsWith("on")
        ? eventType.slice(2).toLowerCase()
        : eventType;
      // console.log(normalizedEventType);

      root.addEventListener(normalizedEventType, (e) => {
        if (
          // 이벤트가 발생한 요소가 우리가 등록한 element인 경우
          // 이벤트 핸들러가 삭제된 경우 실행되지 않도록 처리
          e.target === element &&
          eventListeners.has(element) &&
          eventListeners.get(element).has(eventType)
        ) {
          handler(e);
        }
      });
    }
  }
}

export function addEvent(element, eventType, handler) {
  // element별 이벤트 맵이 없으면 새로 생성
  if (!eventListeners.has(element)) {
    eventListeners.set(element, new Map());
  }
  // element에 대한 이벤트 타입별 핸들러 저장
  const elementEvents = eventListeners.get(element);
  elementEvents.set(eventType, handler);
}

export function removeEvent(element, eventType) {
  if (eventListeners.has(element)) {
    const elementEvents = eventListeners.get(element);
    if (elementEvents.has(eventType)) {
      elementEvents.delete(eventType);
    }
  }
}
