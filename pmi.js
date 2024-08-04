document.getElementById('projectRegistration').addEventListener('click', function() {
    // Redirect to the project registration page
    window.location.href = 'mi.html';
});

document.getElementById('projectDetails').addEventListener('click', function() {
    // Redirect to the project details page
    window.location.href = 'wpf.html';
});


// script.js

// document.getElementById('logout button').addEventListener('click', function() {
//     if (confirm('Are you sure you want to logout?')) {
//         // Terminate the current session here if necessary
//         // Example: Clear session storage, cookies, etc.
//         // sessionStorage.clear(); // Uncomment if using sessionStorage
//         window.location.href = 'login.html';
//     }
// });

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