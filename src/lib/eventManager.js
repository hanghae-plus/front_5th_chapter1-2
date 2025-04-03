export const handlers = new WeakMap(); // 엘리먼트별 이벤트 핸들러 저장
export const allEvents = new Set(); // 모든 이벤트 저장

/**
 * 이벤트 위임 설정
 * handlers WeakMap에 등록된 이벤트들을 자동으로 처리
 * @param {HTMLElement} root - 이벤트 위임을 처리할 루트 엘리먼트
 */
export function setupEventListeners(root) {
  // 등록된 모든 이벤트 타입에 대해 리스너 설정
  allEvents.forEach((eventType) => {
    root.addEventListener(eventType, handleEvent);
  });
}

/**
 * 새로운 함수 추가 : 모든 이벤트에 대한 공통 핸들러
 * @param {Event} e - 발생한 이벤트 객체
 */
const handleEvent = (e) => {
  let element = e.target;
  const eventType = e.type;

  // 이벤트 버블링: 클릭된 엘리먼트부터 부모로 올라가며 검사
  while (element) {
    const elementHandlers = handlers.get(element);

    // 이벤트 핸들러가 있으면 실행하고 종료
    if (elementHandlers?.has(eventType)) {
      elementHandlers.get(eventType)(e);
      break;
    }

    // 핸들러가 없으면 부모 엘리먼트로 이동
    element = element.parentElement;
  }
};

/**
 * 이벤트 핸들러를 WeakMap에 저장
 * @param {HTMLElement} element 이벤트를 추가할 엘리먼트
 * @param {keyof HTMLElementEventMap} eventType - 등록할 이벤트 타입 (예: 'click', 'mouseover')
 * @param {(event: Event) => void} handler  - 실행될 이벤트 핸들러 함수
 */
export function addEvent(element, eventType, handler) {
  if (!handlers.has(element)) {
    handlers.set(element, new Map());
  }

  handlers.get(element).set(eventType, handler);
  allEvents.add(eventType); // 이벤트 타입 기록
}

/**
 * 이벤트 핸들러 제거
 * @param {HTMLElement} element 이벤트를 제거할 엘리먼트
 * @param {keyof HTMLElementEventMap} eventType - 제거할 이벤트 타입 (예: 'click', 'mouseover')
 * 이 부분은 eventType이 key라 안받는것으로 처리 - {(event: Event) => void} handler  - 제거할 이벤트 핸들러 함수
 */
export function removeEvent(element, eventType) {
  // 1. element에 대한 핸들러 맵이 있는지 확인
  const elementHandlers = handlers.get(element);
  if (!elementHandlers) return; // 없으면 종료

  // 2. 해당 이벤트 타입의 핸들러가 있는지 확인
  if (!elementHandlers.has(eventType)) return; // 없으면 종료

  // 3. 이벤트 타입 제거
  elementHandlers.delete(eventType);

  // 4. 엘리먼트에 등록된 이벤트가 하나도 없으면 WeakMap에서 제거
  if (elementHandlers.size === 0) {
    handlers.delete(element);
  }
}

/**
 * 새로운 함수 추가 : 엘리먼트와 그 자식들의 모든 이벤트 제거
 * @param {HTMLElement} element 이벤트를 제거할 엘리먼트
 */
export function cleanupEvents(element) {
  handlers.delete(element);
  allEvents.clear();
}
