const eventMap = new WeakMap(); // 요소별 이벤트 저장소
const eventTypes = new Set(); // 등록된 이벤트 타입 저장소

/**
 * @description root 요소에 등록된 모든 이벤트 리스너를 추가하는 함수
 * @param {HTMLElement} root - 이벤트 리스너를 설정할 루트 요소
 */
export function setupEventListeners(root) {
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

/**
 * @description 이벤트 위임 핸들러
 * @param {Event} event - 발생한 이벤트
 */
function handleEvent(event) {
  let target = event.target;

  // 이벤트가 발생한 요소에서 부모 방향으로 탐색하며 처리 가능한 핸들러를 찾음
  while (target) {
    const elementEvents = eventMap.get(target);

    // 해당 요소에 등록된 이벤트 핸들러가 있는지 확인
    if (elementEvents && elementEvents.has(event.type)) {
      elementEvents.get(event.type).call(target, event);
      break; // 이벤트가 처리되었으면 중단
    }
    target = target.parentElement;
  }
}

/**
 * @description 특정 요소에 이벤트 핸들러를 추가하는 함수
 * @param {HTMLElement} element - 이벤트를 등록할 요소
 * @param {string} eventType - 이벤트 타입
 * @param {Function} handler - 실행할 이벤트 핸들러 함수
 */
export function addEvent(element, eventType, handler) {
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map()); // 이벤트 맵 생성
  }

  const elementEvents = eventMap.get(element);
  elementEvents.set(eventType, handler); // 특정 이벤트 타입에 핸들러 추가

  eventTypes.add(eventType); // 이벤트 타입 저장 setupEventListeners에서 처리
}

/**
 * @description 특정 요소에서 이벤트 핸들러를 제거하는 함수
 * @param {HTMLElement} element - 이벤트를 제거할 요소
 * @param {string} eventType - 제거할 이벤트 타입
 * @returns
 */
export function removeEvent(element, eventType) {
  if (!eventMap.has(element)) {
    return;
  }

  const elementEvents = eventMap.get(element);
  elementEvents.delete(eventType); // 특정한 이벤트 타입의 핸들러 삭제

  // 요소에 등록된 이벤트가 모두 제거되면 WeakMap에서도 삭제
  if (elementEvents.size === 0) {
    eventMap.delete(element);
  }
}
