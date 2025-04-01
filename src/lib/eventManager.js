const eventManager = {};

export function setupEventListeners(root) {
  // eventManager에 등록된 모든 이벤트 타입에 대해 리스너 등록
  Object.keys(eventManager).forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

// 위임된 이벤트 처리
function handleEvent(e) {
  const target = e.target;
  const eventType = e.type;

  // 등록된 핸들러 목록을 처리
  if (eventManager[eventType]) {
    eventManager[eventType].forEach(({ element, handler }) => {
      if (element.contains(target)) {
        handler(e);
      }
    });
  }
}

export function addEvent(element, eventType, handler) {
  // 이벤트 타입에 대한 핸들러 목록이 없다면 초기화
  if (!eventManager[eventType]) {
    eventManager[eventType] = [];
  }

  // 이벤트 핸들러 등록
  eventManager[eventType].push({ element, handler });
}

export function removeEvent(element, eventType, handler) {
  // 해당 이벤트 타입의 핸들러 목록에서 필터링
  if (eventManager[eventType]) {
    eventManager[eventType] = eventManager[eventType].filter(
      (entry) => entry.element !== element || entry.handler !== handler,
    );
  }
}
