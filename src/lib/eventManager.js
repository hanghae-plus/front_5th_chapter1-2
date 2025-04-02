// 이벤트 핸들러를 저장할 맵
const eventHandlers = new Map();
const registeredRoots = new Set();

/**
 * 루트 요소에 이벤트 리스너를 설정합니다.
 * 이벤트 위임 패턴을 사용합니다.
 * @param {HTMLElement} root - 이벤트 위임의 루트 요소
 */
export function setupEventListeners(root) {
  // 이미 이벤트 리스너가 설정된 루트는 건너뜁니다
  if (registeredRoots.has(root)) {
    return;
  }

  registeredRoots.add(root);

  // 모든 이벤트 타입에 대해 한 번씩만 리스너 설정
  const eventTypes = new Set(
    [...eventHandlers.keys()].map((key) => key.split("|")[1]),
  );

  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, (event) => {
      // 이벤트 버블링 단계에서 실제 타겟을 찾아 처리
      let currentTarget = event.target;

      while (currentTarget && currentTarget !== root) {
        const handlersForTarget = findHandlers(currentTarget, eventType);

        if (handlersForTarget.length > 0) {
          handlersForTarget.forEach((handler) => {
            handler(event);
          });

          // 핸들러를 찾았으므로 더 이상 탐색하지 않고 중단
          break;
        }

        currentTarget = currentTarget.parentElement;
      }
    });
  });
}

/**
 * 요소에 이벤트 핸들러를 추가합니다.
 * @param {HTMLElement} element - 이벤트를 받을 요소
 * @param {string} eventType - 이벤트 타입 (예: 'click')
 * @param {Function} handler - 이벤트 핸들러 함수
 */
export function addEvent(element, eventType, handler) {
  const key = generateKey(element, eventType);

  if (!eventHandlers.has(key)) {
    eventHandlers.set(key, []);
  }

  const handlers = eventHandlers.get(key);
  // 이미 동일한 핸들러가 등록되어 있다면 추가하지 않음
  if (!handlers.includes(handler)) {
    handlers.push(handler);
  }
}

/**
 * 요소에서 이벤트 핸들러를 제거합니다.
 * @param {HTMLElement} element - 이벤트를 가진 요소
 * @param {string} eventType - 이벤트 타입 (예: 'click')
 * @param {Function} handler - 제거할 이벤트 핸들러 함수
 */
export function removeEvent(element, eventType, handler) {
  const key = generateKey(element, eventType);

  if (eventHandlers.has(key)) {
    const handlers = eventHandlers.get(key);
    const handlerIndex = handlers.indexOf(handler);

    if (handlerIndex !== -1) {
      handlers.splice(handlerIndex, 1);

      // 핸들러가 더 이상 없으면 맵에서 키 제거
      if (handlers.length === 0) {
        eventHandlers.delete(key);
      }
    }
  }
}

/**
 * 요소와 이벤트 타입을 기반으로 고유 키를 생성합니다.
 * @param {HTMLElement} element - 요소
 * @param {string} eventType - 이벤트 타입
 * @returns {string} 고유 키
 */
function generateKey(element, eventType) {
  // Symbol을 사용하여 요소에 고유 ID를 부여
  if (!element.__eventId) {
    element.__eventId = Symbol("eventId");
  }

  return `${element.__eventId.toString()}|${eventType}`;
}

/**
 * 특정 요소와 이벤트 타입에 등록된 모든 핸들러를 찾습니다.
 * @param {HTMLElement} element - 요소
 * @param {string} eventType - 이벤트 타입
 * @returns {Array<Function>} 핸들러 배열
 */
function findHandlers(element, eventType) {
  const key = generateKey(element, eventType);
  return eventHandlers.has(key) ? eventHandlers.get(key) : [];
}
