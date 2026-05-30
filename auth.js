// ==========================================
// 1. 실시간 날짜 및 시계 기능
// ==========================================
function updateClock() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const dateString = now.toLocaleDateString('ko-KR', options);
    const timeString = now.toLocaleTimeString('ko-KR', { hour12: false });

    const dateDisplay = document.getElementById('date-display');
    const timeDisplay = document.getElementById('time-display');
    
    if (dateDisplay) dateDisplay.innerText = dateString;
    if (timeDisplay) timeDisplay.innerText = timeString;
}
setInterval(updateClock, 1000);
updateClock();


// ==========================================
// 2. 불참 체크박스 토글 제어
// ==========================================
const absenceCheck = document.getElementById('absence-check');
const reasonContainer = document.getElementById('reason-container');

if (absenceCheck && reasonContainer) {
    absenceCheck.addEventListener('change', function() {
        if (this.checked) {
            reasonContainer.classList.remove('hidden');
        } else {
            reasonContainer.classList.add('hidden');
            document.getElementById('absence-reason').value = '';
        }
    });
}


// ==========================================
// 3. 출석 및 상태 제출 (누적 배열 저장 방식)
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

        if (!studentId || !studentName) {
            authMessage.style.color = "#fa3e3e";
            authMessage.innerText = "⚠️ 학번과 이름을 모두 입력해 주세요.";
            return;
        }

        if (isAbsent && !reason) {
            authMessage.style.color = "#fa3e3e";
            authMessage.innerText = "⚠️ 불참 사유를 구체적으로 입력해 주세요.";
            return;
        }

        // 당일 날짜 생성 (키값 활용 및 관리자 분류용)
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // 학생 데이터 생성
        const studentStatus = {
            date: dateKey,
            id: studentId,
            name: studentName,
            session: session,
            isAbsent: isAbsent,
            reason: isAbsent ? reason : "-",
            authTime: currentTime,
            studyTime: "00:00:00",
            isPhotoVerified: "❌ 미인증"
        };

        // [누적 로직] 전체 학생 배열 가져오기
        let allStudentsList = JSON.parse(localStorage.getItem('allStudentsList')) || [];

        // 동일 날짜, 동일 학번, 동일 교시의 중복 제출 여부 확인
        const existingIndex = allStudentsList.findIndex(item => item.date === dateKey && item.id === studentId && item.session === session);

        if (existingIndex !== -1) {
            allStudentsList[existingIndex] = studentStatus; // 기존 기록 수정
        } else {
            allStudentsList.push(studentStatus); // 신규 기록 누적
        }

        // 데이터 저장
        localStorage.setItem('allStudentsList', JSON.stringify(allStudentsList));
        
        // 현재 타이머를 조작 중인 '로그인 세션용' 학생 정보 따로 저장
        localStorage.setItem('currentStudentSession', JSON.stringify({ date: dateKey, id: studentId, session: session }));

        if (isAbsent) {
            authMessage.style.color = "#f5b100";
            authMessage.innerText = `✏️ [제출 완료] 오늘 ${session} 불참 처리가 완료되었습니다.`;
            document.getElementById('student-id').value = '';
            document.getElementById('student-name').value = '';
            absenceCheck.checked = false;
            reasonContainer.classList.add('hidden');
            document.getElementById('absence-reason').value = '';
        } else {
            if (authSection && studySection && welcomeUser) {
                welcomeUser.innerText = studentName;
                authSection.classList.add('hidden');
                studySection.classList.remove('hidden');
            }
        }
    });
}
