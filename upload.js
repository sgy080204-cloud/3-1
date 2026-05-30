const photoFileInput = document.getElementById('photo-file');
const photoPreview = document.getElementById('photo-preview');
const previewContainer = document.getElementById('preview-container');
const submitPhotoBtn = document.getElementById('submit-photo-btn');
const uploadMessage = document.getElementById('upload-message');

if (photoFileInput && photoPreview && previewContainer) {
    photoFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                uploadMessage.style.color = "#fa3e3e";
                uploadMessage.innerText = "⚠️ 이미지 파일만 업로드할 수 있습니다.";
                photoFileInput.value = '';
                previewContainer.classList.add('hidden');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                previewContainer.classList.remove('hidden');
                uploadMessage.innerText = "";
            };
            reader.readAsDataURL(file);
        }
    });
}

if (submitPhotoBtn) {
    submitPhotoBtn.addEventListener('click', function() {
        if (!photoFileInput.files || photoFileInput.files.length === 0) {
            uploadMessage.style.color = "#fa3e3e";
            uploadMessage.innerText = "⚠️ 먼저 인증할 사진을 선택해 주세요!";
            return;
        }

        // [누적 업데이트 로직]
        const sessionData = JSON.parse(localStorage.getItem('currentStudentSession'));
        let allStudentsList = JSON.parse(localStorage.getItem('allStudentsList')) || [];

        if (sessionData) {
            const index = allStudentsList.findIndex(item => item.date === sessionData.date && item.id === sessionData.id && item.session === sessionData.session);
            
            if (index !== -1) {
                const now = new Date();
                const logTime = now.toLocaleTimeString('ko-KR', { hour12: false });
                
                allStudentsList[index].isPhotoVerified = `✅ 완료 (${logTime})`; // 인증 업데이트
                localStorage.setItem('allStudentsList', JSON.stringify(allStudentsList)); // 다시 저장

                uploadMessage.style.color = "#00a400";
                uploadMessage.innerText = "🎉 사진 인증이 성공적으로 완료되었습니다!";
                submitPhotoBtn.disabled = true;
                photoFileInput.disabled = true;
            }
        } else {
            uploadMessage.style.color = "#fa3e3e";
            uploadMessage.innerText = "⚠️ 학생 출석 정보가 존재하지 않습니다.";
        }
    });
}
