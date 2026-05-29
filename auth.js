// ==========================================
// 1. 실시간 날짜 및 시계 기능
// ==========================================
function updateClock() {
    const now = new Date();
    
    // 날짜 포맷 (예: 2026년 5월 29일 금요일)
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const dateString = now.toLocaleDateString('ko-KR', options);
    
    // 시간 포맷 (예: 16:30:05)
    const timeString = now.toLocaleTimeString('ko-KR', { hour12: false });

    // 화면에 반영
    const dateDisplay = document.getElementById('date-display');
    const timeDisplay = document.getElementById('time-display');
    
    if (dateDisplay) dateDisplay.innerText = dateString;
    if (timeDisplay) timeDisplay.innerText = timeString;
}

// 1秒(1000ms)마다 시계 업데이트 실행
setInterval(updateClock, 1000);
updateClock(); // 페이지 로드 시 즉시 한 번 실행


// ==========================================
// 2. 불참 체크박스 토글 제어
// ==========================================
const absenceCheck = document.getElementById('absence-check');
const reasonContainer = document.getElementById('reason-container');

if (absenceCheck && reasonContainer) {
    absenceCheck.addEventListener('change', function() {
        // 체크박스가 켜지면 사유 입력창의 .hidden 클래스를 제거하여 보여줌
        if (this.checked) {
            reasonContainer.classList.remove('hidden');
        } else {
            reasonContainer.classList.add('hidden');
            document.getElementById('absence-reason').value = ''; // 체크 해제 시 내용 초기화
        }
    });
}


// ==========================================
// 3. 출석 및 상태 제출 (화면 전환 핵심 로직)
// ==========================================
const submitAuthBtn = document.getElementById('submit-auth-btn');
const authMessage = document.getElementById('auth-message');

const authSection = document.getElementById('auth-section');
const studySection = document.getElementById('study-section');
const welcomeUser = document.getElementById('welcome-user');

if (submitAuthBtn) {
    submitAuthBtn.addEventListener('click', function() {
        const studentId = document.getElementById('student-id').value.trim();
        const studentName = document.getElementById('student-name').value.trim();
        const isAbsent = absenceCheck.checked;
        const reason = document.getElementById('absence-reason').value.trim();
        const session = document.querySelector('input[name="session"]:checked').value;
        const currentTime = document.getElementById('time-display').innerText;

        // 예외 처리 1: 학번이나 이름이 비어있을 때
        if (!studentId || !studentName) {
            authMessage.style.color = "#fa3e3e"; // 빨간색
            authMessage.innerText = "⚠️ 학번과 이름을 모두 입력해 주세요.";
            return;
        }

        // 예외 처리 2: 불참을 선택했는데 사유가 비어있을 때
        if (isAbsent && !reason) {
            authMessage.style.color = "#fa3e3e";
            authMessage.innerText = "⚠️ 불참 사유를 구체적으로 입력해 주세요.";
            return;
        }

        // 데이터 저장용 객체 생성 (이 상태를 localStorage에 저장하여 다른 페이지와 공유)
        const studentStatus = {
            id: studentId,
            name: studentName,
            session: session,
            isAbsent: isAbsent,
            reason: isAbsent ? reason : "-",
            authTime: currentTime,
            studyTime: "00:00:00", // 초기값 설정 (timer.js에서 업데이트 예정)
            isPhotoVerified: "❌ 미인증" // 초기값 설정 (upload.js에서 업데이트 예정)
        };

        // 로컬 스토리지에 'currentStudent'라는 이름으로 데이터 저장 (글자 형태로 변환)
        localStorage.setItem('currentStudent', JSON.stringify(studentStatus));

        // [핵심] 분기 처리 및 화면 전환
        if (isAbsent) {
            // 불참인 경우: 타이머로 넘어가지 않고 완료 메시지만 출력
            authMessage.style.color = "#f5b100"; // 주황색
            authMessage.innerText = `✏️ [제출 완료] 오늘 ${session} 불참 처리가 완료되었습니다.\n관리자 페이지에서 확인 가능합니다.`;
            
            // 입력창 초기화
            document.getElementById('student-id').value = '';
            document.getElementById('student-name').value = '';
            absenceCheck.checked = false;
            reasonContainer.classList.add('hidden');
            document.getElementById('absence-reason').value = '';
        } else {
            // 출석인 경우: 출석창을 숨기고 타이머&사진인증창을 켬
            if (authSection && studySection && welcomeUser) {
                welcomeUser.innerText = studentName; // 타이머 창에 학생 이름 삽입
                
                authSection.classList.add('hidden');   // 출석창 숨기기
                studySection.classList.remove('hidden'); // 타이머창 보이기
            }
        }
    });
}
