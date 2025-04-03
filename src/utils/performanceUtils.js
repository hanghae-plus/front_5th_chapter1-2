import fs from "fs";
import path from "path";

// 테스트 실행 시간을 기준으로 파일명 생성
let TEST_RUN_ID;

const TEST_BASE_FOLDER = "e2e-performance";
const SESSION_ID_FILE = path.resolve(process.cwd(), ".session-id");
const SESSION_TIMEOUT = 10 * 1000; // 10초 (밀리초)

// 테스트 실행 ID 가져오기 (모든 프로세스가 같은 ID 사용)
function getTestRunId() {
  if (!TEST_RUN_ID) {
    let createNewId = true;
    const now = Date.now();

    // 세션 ID 파일이 있는지 확인
    if (fs.existsSync(SESSION_ID_FILE)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(SESSION_ID_FILE, "utf8"));
        const timeDiff = now - fileData.timestamp;

        // 최근 10분 이내에 생성된 세션이면 기존 ID 재사용
        if (timeDiff < SESSION_TIMEOUT) {
          TEST_RUN_ID = fileData.id;
          createNewId = false;
        }
      } catch (err) {
        // 파일 읽기 오류, 새 ID 생성
        console.error("세션 파일 읽기 오류:", err);
      }
    }

    // 새 ID 생성
    if (createNewId) {
      TEST_RUN_ID = new Date().toISOString().replace(/[:.]/g, "-");

      // 결과 폴더 확인 및 생성
      const folderPath = path.resolve(process.cwd(), TEST_BASE_FOLDER);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // 세션 정보 저장
      try {
        fs.writeFileSync(
          SESSION_ID_FILE,
          JSON.stringify({
            id: TEST_RUN_ID,
            timestamp: now,
          }),
        );
      } catch (err) {
        console.error("세션 ID 저장 오류:", err);
      }

      // 기존 파일 확인 및 초기화
      const resultFile = getResultFilePath(TEST_RUN_ID);
      if (fs.existsSync(resultFile)) {
        fs.unlinkSync(resultFile);
      }

      console.log(`새로운 성능 측정 세션 시작: ${TEST_RUN_ID}`);
      console.log(`결과 파일: ${resultFile}`);
    }
  }
  return TEST_RUN_ID;
}

// 결과 파일 경로 가져오기
function getResultFilePath(id) {
  return path.resolve(process.cwd(), `${TEST_BASE_FOLDER}/result-${id}.csv`);
}

// 단순 성능 측정 함수
export async function measurePerformance(page, action, label) {
  // 시작 시간 측정
  const startTime = Date.now();

  // 동작 수행
  await action();

  // 종료 시간 측정
  const endTime = Date.now();
  const duration = endTime - startTime;

  // 메모리 측정
  const endMemory = await page.evaluate(() => {
    return performance.memory?.usedJSHeapSize || 0;
  });

  // 메모리 사용량 계산
  const memoryUsageMB = endMemory
    ? (endMemory / (1024 * 1024)).toFixed(2)
    : "N/A";

  // 결과 생성
  const result = {
    label,
    timestamp: new Date().toISOString(),
    duration,
    memoryUsage: memoryUsageMB,
    url: await page.url(),
  };

  // 파일에 즉시 추가
  appendResultToFile(result);

  // 콘솔에 출력
  console.log(`[${label}] 소요시간: ${duration}ms, 메모리: ${memoryUsageMB}MB`);

  return result;
}

/**
 * 결과 파일에 결과 추가
 * @param {*} result 테스트 결과
 */
function appendResultToFile(result) {
  const runId = getTestRunId();
  const filePath = getResultFilePath(runId);

  // 파일 쓰기 시도 (경합 조건 처리)
  try {
    // 파일이 존재하는지 확인
    const fileExists = fs.existsSync(filePath);

    // 새 파일이면 헤더 추가
    if (!fileExists) {
      fs.writeFileSync(
        filePath,
        "Timestamp,Label,Duration(ms),MemoryUsage(MB),URL\n",
      );
    }

    // 결과 행 추가
    const row =
      [
        result.timestamp,
        `"${result.label}"`,
        result.duration,
        result.memoryUsage,
        `"${result.url}"`,
      ].join(",") + "\n";

    // 파일에 추가할 때 락 사용 (간단한 재시도 메커니즘)
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        fs.appendFileSync(filePath, row);
        break;
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.error("결과 파일 쓰기 실패:", err);
          break;
        }
        // 짧은 대기 후 재시도
        setTimeout(() => {}, 50 * attempts);
      }
    }
  } catch (err) {
    console.error("파일 처리 오류:", err);
  }
}
