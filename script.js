document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('workoutChart').getContext('2d');
    const workoutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['웜업', '드릴', '메인', '대쉬', '쿨다운'],
            datasets: [{
                label: '소요 시간 (분)',
                data: [20, 25, 50, 10, 15],
                backgroundColor: [
                    'rgba(56, 189, 248, 0.7)', 
                    'rgba(14, 165, 233, 0.7)',
                    'rgba(2, 132, 199, 0.8)',
                    'rgba(125, 211, 252, 0.7)',
                    'rgba(186, 230, 253, 0.7)'
                ],
                borderColor: ['rgba(255, 255, 255, 1)'],
                borderWidth: 3,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'top', 
                    labels: { 
                        font: { 
                            family: "'Noto Sans KR', sans-serif", 
                            size: 14 
                        } 
                    } 
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed !== null) { label += context.parsed + '분'; }
                            return label;
                        }
                    }
                }
            }
        }
    });

    const getTipBtn = document.getElementById('getTipBtn');
    const getMealBtn = document.getElementById('getMealBtn');
    const aiModal = document.getElementById('aiModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalText = document.getElementById('modalText');
    const loader = document.getElementById('loader');

    const API_KEY = ""; // 여기에 실제 API 키를 넣어야 합니다. (현재는 비어있음)
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    async function callGeminiAPI(prompt, maxRetries = 3) {
        let currentAttempt = 0;
        while (currentAttempt < maxRetries) {
            try {
                const payload = {
                    contents: [{
                        role: "user",
                        parts: [{ text: prompt }]
                    }]
                };
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    return result.candidates[0].content.parts[0].text;
                } else {
                    throw new Error("API 응답이 비어있습니다.");
                }
            } catch (error) {
                currentAttempt++;
                if (currentAttempt >= maxRetries) {
                    console.error("Gemini API 호출 실패:", error);
                    return "죄송합니다, 답변을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.";
                }
                const delay = Math.pow(2, currentAttempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    function showModal(title) {
        modalTitle.textContent = title;
        modalText.innerHTML = '';
        loader.style.display = 'block';
        aiModal.classList.remove('modal-hidden');
    }

    function hideModal() {
        aiModal.classList.add('modal-hidden');
    }

    function displayContent(text) {
        loader.style.display = 'none';
        modalText.innerHTML = text.replace(/\n/g, '<br>');
    }

    getTipBtn.addEventListener('click', async () => {
        showModal('✨ 오늘의 수영 팁');
        const prompt = "저는 8년 만에 다시 수영을 시작하려고 합니다. 여자친구와 함께 2시간 동안 운동할 계획입니다. 계획은 웜업, 킥판 발차기와 한팔 수영 드릴, 피라미드 인터벌, 그리고 대쉬로 구성되어 있습니다. 오랜만에 하는 수영이라 조금 긴장됩니다. 오늘 저에게 딱 맞는, 짧고 격려가 되는 팁 한 가지를 알려주세요.";
        const responseText = await callGeminiAPI(prompt);
        displayContent(responseText);
    });

    getMealBtn.addEventListener('click', async () => {
        showModal('✨ 운동 후 추천 식단');
        const prompt = "방금 2시간 동안 수영을 마친 커플을 위한 건강하고 맛있는 아침 식사 메뉴를 추천해주세요. 한국에서 쉽게 구할 수 있는 재료로 만들 수 있는 간단한 메뉴 2~3가지를 제안해주세요.";
        const responseText = await callGeminiAPI(prompt);
        displayContent(responseText);
    });

    closeModalBtn.addEventListener('click', hideModal);
    aiModal.addEventListener('click', (event) => {
        if (event.target === aiModal) {
            hideModal();
        }
    });
});
