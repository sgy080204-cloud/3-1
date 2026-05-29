// ==========================================
// 학습 타이머 제어 변수
// ==========================================
let timerId = null;     // setInterval을 제어할 ID
let totalSeconds = 0;   // 누적 공부 시간 (초 단위)
let isRunning = false;  // 현재 타이머가 작동 중인지 여부

// DOM 요소 가져오기
const timerDisplay = document.getElementById('timer-display');
const timerStartBtn = document.getElementById('timer-start-btn');
const timerPauseBtn = document.getElementById('timer-pause-btn');
const timerStopBtn = document.getElementById('timer-stop-btn');
const timerMessage = document.getElementById('timer-message');

// ==========================================
// 시간 포맷 변환 함수 (초 -> 00:00:00)
// ==========================================
function formatTimer(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// ==========================================
// [기능 1] 학습 시작
// ==========================================
if (timerStartBtn) {
    timerStartBtn.addEventListener('click', function() {
        if (isRunning) return; // 이미 실행 중이면 중복 실행 방지

        isRunning = true;
        timerMessage.style.color = "#00a400";
        timerMessage.innerText = "🔥 집중해서 열공 중인 시간입니다!";

        // 버튼 활성화/비활성화 제어
        timerStartBtn.disabled = true;
        timerPauseBtn.disabled = false;
        timerStopBtn.disabled = false;

        // 1초마다 totalSeconds를 1씩 증가시키고 화면에 표시
        timerId = setInterval(function() {
            totalSeconds++;
            timerDisplay.innerText = formatTimer(totalSeconds);
        }, 1000);
    });
}

// ==========================================
// [기능 2] 잠시 멈춤 (일시 중단)
// ==========================================
if (timerPauseBtn) {
    timerPauseBtn.addEventListener('click', function() {
        if (!isRunning) return;

        isRunning = false;
        clearInterval(timerId); // 타이머 일시 정지

        timerMessage.style.color = "#f5b100";
        timerMessage.innerText = "⏸️ 잠시 숨을 고르는 중입니다. 쉬고 다시 시작하세요!";

        // 버튼 상태 변경
        timerStartBtn.disabled = false;
        timerPauseBtn.disabled = true;
    });
}

// ==========================================
// [기능 3] 학습 종료
// ==========================================
if (timerStopBtn) {
    timerStopBtn.addEventListener('click', function() {
        // 정말 종료할 것인지 최종 확인 창 띄우기 (고3들의 실수 방지)
        const confirmStop = confirm("오늘 자습을 정말 종료하시겠습니까? 종료 후에는 시간이 저장됩니다.");
        
        if (confirmStop) {
            isRunning = false;
            clearInterval(timerId); // 타이머 완전히 정지

            const finalTimeText = timerDisplay.innerText;
            timerMessage.style.color = "#333333";
            timerMessage.innerText = `🏁 오늘 총 학습 시간 [ ${finalTimeText} ] 기록 완료!`;

            // ------------------------------------------
            // [데이터 연동] 저장소에 공부 시간 업데이트
            // ------------------------------------------
            // auth.js에서 저장했던 현재 학생 데이터를 가져옴
            const currentStudentData = localStorage.getItem('currentStudent');
            
            if (currentStudentData) {
                const student = JSON.parse(currentStudentData);
                student.studyTime = finalTimeText; // 기록된 공부 시간으로 업데이트

                // 수정한 데이터를 다시 브라우저 저장소에 저장
                localStorage.setItem('currentStudent', JSON.stringify(student));
            }

            // 모든 타이머 버튼 및 데이터 초기화 (내일 다시 할 수 있도록)
            timerStartBtn.disabled = false;
            timerPauseBtn.disabled = true;
            timerStopBtn.disabled = true;
            totalSeconds = 0;
            timerDisplay.innerText = "00:00:00";
        }
    });
}
