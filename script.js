document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);

    // Clone slides to create seamless infinite loop effect if desired
    // For this specific requirement "slide should move within 5 seconds", 
    // we will implement a simple transition to the next slide

    let currentIndex = 0;

    function moveToNextSlide() {
        currentIndex++;

        // Reset to first slide if we reach the end
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }

        // Calculate the amount to shift
        // Assuming each slide takes up 100% width of the container
        const amountToMove = -100 * currentIndex;
        track.style.transform = `translateX(${amountToMove}%)`;
    }

    // Set interval for 5 seconds (5000ms)
    setInterval(moveToNextSlide, 5000);

    // Contact Form Submission
    const contactForm = document.querySelector('form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('textarea');
            const submitBtn = contactForm.querySelector('button');

            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            };

            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('http://localhost:5000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Failed to send message: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
