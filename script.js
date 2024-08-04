// script.js
function includeHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });
}

function logout() {
    // Logic to handle logout, e.g., clearing session data, redirecting to login page
    // alert("Logging out...");
    window.location.href = 'login.html';
}

function confirmLogout() {
    const confirmationDialog = document.getElementById('confirmation-dialog');
    confirmationDialog.style.display = 'block';
}

function cancelLogout() {
    const confirmationDialog = document.getElementById('confirmation-dialog');
    confirmationDialog.style.display = 'none';
}
