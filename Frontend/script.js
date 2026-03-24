document.addEventListener('DOMContentLoaded', () => {

    // Wake up backend (Render sleeps on free tier)
    fetch('https://jacob-website-tg0e.onrender.com/ping')
        .catch(() => console.log('Backend wake-up ping sent'));

    // Initialize Chart.js Attendance Graph
    const ctx = document.getElementById('attendanceChart').getContext('2d');

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(108, 92, 231, 0.8)');
    gradient.addColorStop(1, 'rgba(108, 92, 231, 0.1)');

    const attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'],
            datasets: [{
                label: 'Attendance Percentage (%)',
                data: [95, 92, 98, 94, 97, 96],
                backgroundColor: gradient,
                borderColor: '#A29BFE',
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6C5CE7',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#F8F9FA' }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: { color: '#ADB5BD' }
                },
                x: {
                    ticks: { color: '#ADB5BD' }
                }
            }
        }
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            contactInfo: document.getElementById('contactInfo').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        try {
            // USE RENDER BACKEND URL
            const response = await fetch('https://jacob-website-tg0e.onrender.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                formMessage.innerText = 'Thanks! Your message has been sent successfully.';
                formMessage.style.color = '#4cd137';
                contactForm.reset();
            } else {
                formMessage.innerText = 'Error sending message.';
                formMessage.style.color = '#e84118';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formMessage.innerText = 'Unable to connect to server. Please try again later.';
            formMessage.style.color = '#e84118';
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;

            setTimeout(() => {
                formMessage.innerText = '';
            }, 5000);
        }
    });
});