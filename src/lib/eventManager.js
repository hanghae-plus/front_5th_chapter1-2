// 이벤트 핸들러를 저장할 맵
const eventHandlers = new Map();

/**
 * 요소에 이벤트 핸들러를 추가합니다.
 * 실제로는 핸들러를 eventHandlers 맵에 저장합니다.
 */
export function addEvent($el, eventType, handler) {
  // 요소에 고유 ID 부여 (없다면)
  if (!$el._eid) {
    $el._eid = Date.now() + Math.random().toString(36).substring(2, 9);
  }

  // 해당 요소의 이벤트 맵 가져오기 또는 생성
  if (!eventHandlers.has($el._eid)) {
    eventHandlers.set($el._eid, new Map());
  }

  const elementEvents = eventHandlers.get($el._eid);

  // 특정 이벤트 타입의 핸들러 목록 가져오기 또는 생성
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  // 핸들러 추가
  elementEvents.get(eventType).add(handler);
}

/**
 * 요소에서 이벤트 핸들러를 제거합니다.
 */
export function removeEvent($el, eventType, handler) {
  if (!$el._eid || !eventHandlers.has($el._eid)) return;

  const elementEvents = eventHandlers.get($el._eid);

  if (!elementEvents.has(eventType)) return;

  // 핸들러 제거
  elementEvents.get(eventType).delete(handler);

  // 이벤트 타입에 핸들러가 없으면 맵에서 제거
  if (elementEvents.get(eventType).size === 0) {
    elementEvents.delete(eventType);
  }

  // 요소에 등록된 이벤트가 없으면 맵에서 제거
  if (elementEvents.size === 0) {
    eventHandlers.delete($el._eid);
  }
}

/**
 * 이벤트 위임을 위한 이벤트 리스너 설정
 */
export function setupEventListeners($container) {
  // 이미 이벤트 설정이 완료된 컨테이너는 처리하지 않음
  if ($container._hasEventListeners) return;

  // 설정 완료 플래그 추가
  $container._hasEventListeners = true;

  // 지원할 이벤트 타입 목록
  const eventTypes = [
    "click",
    "mouseover",
    "mouseout",
    "focus",
    "blur",
    "input",
    "change",
    "keydown",
    "keyup",
    "submit",
  ];

  // 각 이벤트 타입에 대한 위임 핸들러 등록
  eventTypes.forEach((eventType) => {
    $container.addEventListener(eventType, (event) => {
      // 이벤트가 발생한 요소부터 상위로 올라가며 처리 (캡처링 구현)
      let target = event.target;

      while (target && target !== $container) {
        // 현재 요소에 등록된 이벤트 핸들러 실행
        if (target._eid && eventHandlers.has(target._eid)) {
          const elementEvents = eventHandlers.get(target._eid);

          if (elementEvents.has(eventType)) {
            const handlers = elementEvents.get(eventType);

            // 핸들러 모두 실행
            handlers.forEach((handler) => {
              handler(event);
            });

            // 이벤트가 stopPropagation()으로 중단됐으면 순회 중단
            if (event.cancelBubble || !event.bubbles) {
              break;
            }
          }
        }

        // 상위 요소로 이동
        target = target.parentNode;
      }
    });
  });
}
