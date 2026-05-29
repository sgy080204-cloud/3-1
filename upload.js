// ==========================================
// 사진 인증 제어 변수 및 DOM 요소 가져오기
// ==========================================
const photoFileInput = document.getElementById('photo-file');
const photoPreview = document.getElementById('photo-preview');
const previewContainer = document.getElementById('preview-container');
const submitPhotoBtn = document.getElementById('submit-photo-btn');
const uploadMessage = document.getElementById('upload-message');

// ==========================================
// [기능 1] 파일 선택 시 미리보기 화면에 띄우기
// ==========================================
if (photoFileInput && photoPreview && previewContainer) {
    photoFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0]; // 사용자가 선택한 첫 번째 파일

        if (file) {
            // 파일이 진짜 이미지 파일인지 확인 (보안 및 에러 방지)
            if (!file.type.startsWith('image/')) {
                uploadMessage.style.color = "#fa3e3e";
                uploadMessage.innerText = "⚠️ 이미지 파일(jpg, png 등)만 업로드할 수 있습니다.";
                photoFileInput.value = ''; // 선택한 파일 초기화
                previewContainer.classList.add('hidden'); // 미리보기 숨기기
                return;
            }

            // 파일을 읽어서 이미지 주소로 변환해주는 도구(FileReader) 사용
            const reader = new FileReader();
            
            reader.onload = function(e) {
                photoPreview.src = e.target.result; // 변환된 이미지 주소를 img 태그에 넣음
                previewContainer.classList.remove('hidden'); // 숨겨져 있던 미리보기 구역 보여주기
                uploadMessage.innerText = ""; // 기존 에러 메시지 삭제
            };

            reader.readAsDataURL(file); // 파일을 읽기 시작
        }
    });
}

// ==========================================
// [기능 2] 사진 인증 완료 버튼 클릭 시 데이터 업데이트
// ==========================================
if (submitPhotoBtn) {
    submitPhotoBtn.addEventListener('click', function() {
        // 예외 처리: 사진을 선택하지 않고 완료 버튼을 누른 경우
        if (!photoFileInput.files || photoFileInput.files.length === 0) {
            uploadMessage.style.color = "#fa3e3e";
            uploadMessage.innerText = "⚠️ 먼저 인증할 사진을 선택하거나 촬영해 주세요!";
            return;
        }

        // ------------------------------------------
        // [데이터 연동] 저장소에 사진 인증 상태 업데이트
        // ------------------------------------------
        const currentStudentData = localStorage.getItem('currentStudent');

        if (currentStudentData) {
            const student = JSON.parse(currentStudentData);
            
            // 인증 상태를 기존 '❌ 미인증'에서 현재 시간과 함께 '✅ 완료'로 변경
            const now = new Date();
            const logTime = now.toLocaleTimeString('ko-KR', { hour12: false });
            student.isPhotoVerified = `✅ 인증 완료 (${logTime})`;

            // 변경된 데이터를 다시 브라우저 저장소에 저장
            localStorage.setItem('currentStudent', JSON.stringify(student));

            // 성공 메시지 출력 및 버튼 비활성화 (중복 인증 방지)
            uploadMessage.style.color = "#00a400";
            uploadMessage.innerText = "🎉 사진 인증이 성공적으로 완료되었습니다! 이제 안전하게 창을 닫으셔도 됩니다.";
            submitPhotoBtn.disabled = true;
            photoFileInput.disabled = true;
        } else {
            uploadMessage.style.color = "#fa3e3e";
            uploadMessage.innerText = "⚠️ 학생 출석 정보가 존재하지 않습니다. 새로고침 후 다시 시도해 주세요.";
        }
    });
}
