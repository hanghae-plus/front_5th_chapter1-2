const eventManager = {};

export function setupEventListeners(root) {
  root.addEventListener("click", (e) => {
    // 이벤트 발생 시, 해당 이벤트가 발생한 요소를 찾고 처리
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
  });
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
