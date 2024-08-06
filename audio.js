document.getElementById('registerButton').addEventListener('click', (e) => {
    createConfetti();
});

function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
        confetti.style.left = `${Math.random() * window.innerWidth}px`;
        confetti.style.top = `${Math.random() * window.innerHeight}px`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.animationDuration = `2s`;

        confettiContainer.appendChild(confetti);

        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}
