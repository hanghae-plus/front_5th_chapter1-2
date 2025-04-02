/**
 * 이벤트 핸들러를 저장할 맵
 * 이벤트 타입(eventType)을 키로 갖고, 그 값으로 WeakMap을 저장하는 구조
 * eventRegistry = {
 *   "click" : WeakMap {
 *     element1 : handler1,
 *     element2 : handler2,
 *     ...
 *   },
 *   "input" : WeakMap {
 *     element1 : handler1,
 *     ...
 *   },
 *   ...
 * }
 */
export const eventRegistry = new Map();

/**
 * 컨테이너에 등록된 이벤트 리스너를 추적하는 WeakMap
 * containerListeners = WeakMap<HTMLElement, Map<string, function>>
 */
const containerListeners = new WeakMap();

/**
 * 컨테이너에 실제 이벤트 리스너 설정
 * @param {HTMLElement} root - 이벤트를 위임받을 컨테이너
 */
export function setupEventListeners(root) {
  // 이 컨테이너에 대한 리스너 맵 가져오기 (없으면 생성)
  if (!containerListeners.has(root)) {
    containerListeners.set(root, new Map());
  }

  const listeners = containerListeners.get(root);
  console.log("listeners:", listeners);

  // 등록된 모든 이벤트 타입에 대해 이벤트 리스너 설정
  eventRegistry.forEach((typeHandlers, eventType) => {
    // 이미 이 이벤트 타입에 대한 리스너가 설정되어 있는지 확인
    if (!listeners.has(eventType)) {
      const eventListener = (event) => {
        // 해당 이벤트 타입으로 등록된 모든 요소 순회
        typeHandlers.forEach((handlers, element) => {
          // 이벤트 타겟이 대상 요소와 일치하거나 그 자손인지 확인
          if (
            handlers.length > 0 &&
            (event.target === element || element.contains(event.target))
          ) {
            handlers.forEach((handler) => handler(event));
          }
        });
      };

      // 이벤트 리스너 등록
      root.addEventListener(eventType, eventListener);

      // 등록된 리스너 추적
      listeners.set(eventType, eventListener);
    }
  });
}

/**
 * 요소에 이벤트 위임 방식으로 이벤트 등록
 * 이벤트 저장만 하고 실행은 안 함
 * @param {HTMLElement} element - 이벤트를 등록할 요소
 * @param {string} eventType - 이벤트 타입 (예: 'click', 'input')
 * @param {Function} handler - 이벤트 핸들러 함수
 * */
export function addEvent(element, eventType, handler) {
  console.log(`이벤트 추가: ${eventType} - 요소:`, element);

  // 이벤트 타입별 맵이 없으면 생성
  if (!eventRegistry.has(eventType)) {
    eventRegistry.set(eventType, new Map());
  }

  const typeHandlers = eventRegistry.get(eventType);

  // 요소별 핸들러 배열이 없으면 생성
  if (!typeHandlers.has(element)) {
    typeHandlers.set(element, []);
  }

  // 중복 등록 방지
  const handlers = typeHandlers.get(element);
  const isDuplicate = handlers.some(
    (_handler) => _handler.toString() === handler.toString(),
  );

  if (!isDuplicate) {
    // 핸들러 추가
    handlers.push(handler);
  }
}

export function removeEvent(element, eventType, handler) {
  // 해당 이벤트 타입의 핸들러 맵이 없으면 종료
  if (!eventRegistry.has(eventType)) return;

  const typeHandlers = eventRegistry.get(eventType);

  // 해당 요소의 핸들러 배열이 없으면 종료
  if (!typeHandlers.has(element)) return;

  // 현재 요소에 등록된 핸들러 배열 가져오고 해당 핸들러 제거
  const filteredHandlers = typeHandlers
    .get(element)
    .filter((_handler) => _handler !== handler);

  // 핸들러가 남아 있으면 업데이트해주고 없으면 요소자체를 삭제
  if (filteredHandlers.length > 0) {
    typeHandlers.set(element, filteredHandlers);
  } else {
    typeHandlers.delete(element);

    // 이 이벤트 타입에 등록된 요소가 더 이상 없으면 이벤트 타입 자체를 제거
    if (typeHandlers.size === 0) {
      eventRegistry.delete(eventType);
    }
  }
}
