// 1. addEvent와 removeEvent를 통해 element에 대한 이벤트 함수를 어딘가에 저장하거나 삭제합니다.
// 2. setupEventListeners를 이용해서 이벤트 함수를 가져와서 한 번에 root에 이벤트를 등록합니다.

const eventTypes = []; // 이벤트 타입(e.g. 'click', 'mouseover')을 저장하는 배열 - 등록된 이벤트 타입을 추적하기 위해 사용
const elementMap = new Map(); // 이벤트 핸들러 저장소 - DOM 요소와 해당 요소에 연결된 이벤트 핸들러를 저장하는 Map 객체

const handleEvent = (e) => {
  //이벤트 위임 핸들러
  const targetMap = elementMap.get(e.target); // 이벤트 발생 요소 검색
  const handler = targetMap?.get(e.type); // 현재 이벤트 타입에 해당하는 핸들러 가져옴
  if (handler) {
    handler.call(e.target, e); // .call() - 핸들러의 this를 e.target(이벤트가 발생한 요소)로 설정
  }
};

export function setupEventListeners(root) {
  // root 요소에 모든 이벤트 타입을 한 번에 등록 - 리렌더링 시 이벤트 재등록 불필요
  eventTypes.forEach((eventType) => {
    // 배열에 저장된 모든 이벤트 타입을 순회하며 실행
    root.addEventListener(eventType, handleEvent); // 각 이벤트 타입에 대해 root 요소에 handleEvent를 리스너로 등록
  }); // root에서 발생하는 모든 이벤트를 처리할 수 있게 됨
}

// 신규 이벤트 타입 등록 - 특정 DOM 요소(element)에 특정 타입의 이벤트(eventType)와 핸들러(handler)를 등록
export function addEvent(element, eventType, handler) {
  if (!eventTypes.includes(eventType)) {
    // 중복 방지
    eventTypes.push(eventType);
  }

  const targetMap = elementMap.get(element) || new Map(); // elementMap에서 해당 요소의 데이터를 가져오거나 없으면 새로 생성
  if (targetMap.get(eventType) === handler) return; // 중복 방지
  targetMap.set(eventType, handler); // 핸들러 저장
  elementMap.set(element, targetMap); // 변경된 데이터를 다시 elementMap에 저장
}

// 특정 DOM 요소에서 특정 타입의 이벤트와 핸들러를 제거
export function removeEvent(element, eventType, handler) {
  const targetMap = elementMap.get(element); // 데이터 조회
  if (!targetMap) return;

  if (targetMap.get(eventType) === handler) {
    // 삭제하려는 핸들러가 현재 저장된 핸들러와 동일하면
    targetMap.delete(eventType); //특정 이벤트 타입과 연결된 핸들러 삭제
  }

  if (targetMap.size === 0) {
    // 해당 요소에 등록된 이벤트 없다면 elementMap에서도 삭제 - 메모리 절약
    elementMap.delete(element);
  }
}

// <동작 시나리오>
// 이벤트 발생 시
// [이벤트 버블링] → root 요소 캐치 → handleEvent 실행
// → e.target에서 button 요소 확인
// → elementMap에서 button의 click 핸들러 검색
// → 핸들러 실행

// <전체 동작 흐름>
// 사용자가 특정 DOM 요소에 대해 addEvent()로 이벤트와 핸들러를 등록하면 데이터가 elementMap과 eventTypes에 저장

// 사용자 인터페이스 초기화 시 setupEventListeners()로 루트 요소에 모든 필요한 이벤트 리스너를 등록

// 실제로 이벤트가 발생하면 루트에서 이를 캐치하고 handleEvent()가 호출

// handleEvent()는 발생한 대상과 이벤트 타입을 기반으로 적절한 핸들러를 찾아 실행

// 필요 시 특정 핸들러는 removeEvent()로 제거 가능
