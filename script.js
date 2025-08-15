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
                    'rgba(56, 189, 248, 0.7)', // sky-400
                    'rgba(14, 165, 233, 0.7)', // sky-500
                    'rgba(2, 132, 199, 0.8)',  // sky-600
                    'rgba(125, 211, 252, 0.7)',// sky-300
                    'rgba(186, 230, 253, 0.7)' // sky-200
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)'
                ],
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
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '분';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
});
