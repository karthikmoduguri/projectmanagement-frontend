document.getElementById('registerButton').addEventListener('click', () => {
    speak("You have been successfully registered");
});

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    } else {
        console.log('Speech Synthesis API is not supported in this browser.');
    }
}
