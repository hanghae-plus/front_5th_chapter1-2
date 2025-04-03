// 모든 이벤트 핸들러를 저장할 전역 Map 객체 생성
const eventHandlers = new Map();

/**
 * 요소에 이벤트 핸들러 추가
 * @param {*} $el 요소
 * @param {*} eventType 이벤트 타입
 * @param {*} handler 핸들러
 * @returns 요소
 */
export function addEvent($el, eventType, handler) {
  // 요소에 고유 ID가 없으면 생성
  if (!$el._eid) {
    $el._eid = Date.now() + Math.random().toString(36).substring(2, 9);
  }

  // 요소별 이벤트 맵 관리
  // 없으면 새로 생성
  if (!eventHandlers.has($el._eid)) {
    eventHandlers.set($el._eid, new Map());
  }

  // 있으면 기존 맵 가져옴
  const elementEvents = eventHandlers.get($el._eid);

  // 이벤트 타입별 핸들러 Set 관리
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  // 핸들러 Set에 추가 (중복 방지)
  elementEvents.get(eventType).add(handler);
}

/**
 * 요소에서 이벤트 핸들러 제거
 * @param {*} $el 요소
 * @param {*} eventType 이벤트 타입
 * @param {*} handler 핸들러
 * @returns 요소
 */
export function removeEvent($el, eventType, handler) {
  // 요소 ID나 이벤트 맵이 없으면 종료
  if (!$el._eid || !eventHandlers.has($el._eid)) return;

  // 있으면 요소 이벤트 맵 가져오기
  const elementEvents = eventHandlers.get($el._eid);

  // 해당 이벤트 타입이 없으면 종료
  if (!elementEvents.has(eventType)) return;

  // 있으면 핸들러 제거
  elementEvents.get(eventType).delete(handler);

  // 이벤트 타입에 핸들러가 없으면 이벤트 타입 삭제
  if (elementEvents.get(eventType).size === 0) {
    elementEvents.delete(eventType);
  }

  // 요소에 이벤트가 없으면 요소 자체를 맵에서 삭제
  if (elementEvents.size === 0) {
    eventHandlers.delete($el._eid);
  }
}

/**
 * 이벤트 위임을 위한 이벤트 리스너 설정
 * @param {*} $container 컨테이너
 * @returns 컨테이너
 */
export function setupEventListeners($container) {
  // 이벤트 설정이 이미 되어있으면 중복 설정 방지
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

  // 각 이벤트 타입에 대해 컨테이너에 위임 핸들러 등록
  eventTypes.forEach((eventType) => {
    $container.addEventListener(eventType, (event) => {
      let target = event.target; // 이벤트가 발생한 가장 하위 요소에서 시작

      // 이벤트 발생 요소부터 상위로 순회 (이벤트 버블링)
      while (target && target !== $container) {
        // 현재 요소에 등록된 이벤트 핸들러 실행
        if (target._eid && eventHandlers.has(target._eid)) {
          const elementEvents = eventHandlers.get(target._eid);

          // 해당 이벤트 타입의 모든 핸들러 실행
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

        // 부모 요소로 이동해서 계속 순회
        target = target.parentNode;
      }
    });
  });
}
