function goToLogin() {
    // Logic to navigate to login page
    window.location.href = 'login.html'; // assuming login.html is your login page
}

document.getElementById('registration-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    // Get form data
    const username = document.getElementById('projectId').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const registrationKey = document.getElementById('key').value;
  console.log(username)
    // Send data to backend
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password,role,registrationKey }),
      });
  
      const data = await response.json();
      
      // Display success or error message
    } catch (error) {
      document.getElementById('responseMessage').innerText = 'An error occurred.';
    }
  });
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
