// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.

// 이벤트 저장소
const eventStore = new Map();
// WeakMap -> cursor사용
// TODO:무엇인가? -> 메모리에 더 좋음
const containerEventTypes = new WeakMap();

// 이벤트 등록 함수
export function addEvent(element, eventType, handler) {
  // 요소별 이벤트 저장
  if (!eventStore.has(eventType)) {
    eventStore.set(eventType, new Map());
  }

  const elementEvents = eventStore.get(eventType);
  elementEvents.set(element, handler);
}

// 이벤트 위임 설정하는 함수
export function setupEventListeners(root) {
  // root -> 이벤트 리스너가 연결될 상위 컨테이너 요소
  // ex) setupEventListeners(document.getElementById('app')) 호출시 'app' 요소

  // 루트 요소가 처음 등록되는 경우 빈 Set 생성
  if (!containerEventTypes.has(root)) {
    containerEventTypes.set(root, new Set());
  }

  // 현재 루트요소에 이미 등록된 이벤트타임 set 가져오기
  // ex) 'app' 요소에 이미 'click' 이벤트가 등록되어 있다면, events는 Set('click')
  const events = containerEventTypes.get(root);

  // 등록된 모든 이벤트 타입에 대해서 반복
  // ex) events에 'click' 이벤트가 등록되어 있다면, 각각에 대해 반복
  eventStore.forEach((delegates, eventType) => {
    // 이미 등록된 이벤트 타입이면 건너뜀
    // ex) 'click' 이벤트가 등록되어 있다면, click 처리 건너뜀

    if (events.has(eventType)) return;

    // 루트 요소에 이벤트 리스너 등록
    // ex) app.addEventListener('click', (event) => { ... })
    root.addEventListener(eventType, (event) => {
      // 해당 이벤트 타입에 등록된 모든 대상 요소와 핸들러 쌍을 반복
      // 'click' 이벤트에 대해 {'삭제 버튼' => handleDelete, '할일 항목' => handleToggle}과 같은 매핑이 있다면, 각각에 대해 반복
      for (const [target, handler] of delegates) {
        // 이벤트가 발생한 요소가 현재 대상 요소 내부에 있는지 확인
        // ex) 삭제 버튼 클릭 시, 이벤트가 발생한 요소가 삭제 버튼 내부에 있는지 확인
        if (target.contains(event.target)) {
          // 핸들러 호출
          // ex) handleDelete.call(삭제 버튼, 클릭 이벤트)
          handler.call(target, event);
        }
      }
    });

    // 이벤트 타입 등록
    // 'click' 이벤트를 처리한 후, boundEvents.add('click')으로 'click'을 등록된 이벤트 목록에 추가
    events.add(eventType);
  });
}

// 이벤트 제거 함수
export function removeEvent(element, eventType, handler) {
  const elementEvents = eventStore.get(eventType);
  if (!elementEvents.has(element)) return;

  if (elementEvents.get(element) === handler) {
    elementEvents.delete(element);
  }
}
