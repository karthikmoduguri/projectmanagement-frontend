document.addEventListener('DOMContentLoaded', function() {
    const updateButton = document.getElementById('update-button');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');

    // Load saved phase states from localStorage
    const savedPhases = JSON.parse(localStorage.getItem('phases')) || {};
    for (const [phaseId, timestamp] of Object.entries(savedPhases)) {
        const checkbox = document.getElementById(phaseId);
        const timestampSpan = document.getElementById(`${phaseId}-timestamp`);
        checkbox.checked = true;
        checkbox.parentElement.classList.add('completed');
        timestampSpan.textContent = `Completed at: ${timestamp}`;
    }

    updateButton.addEventListener('click', function() {
        const phases = [
            { id: 'phase1', name: 'Phase 1: Ideation and Design' },
            { id: 'phase2', name: 'Phase 2: Hardware Development' },
            { id: 'phase3', name: 'Phase 3: Software Integration' },
            { id: 'phase4', name: 'Phase 4: Design' },
            { id: 'phase5', name: 'Phase 5: Manufacturing & Production' },
            { id: 'phase6', name: 'Phase 6: Deployment & Testing' }
        ];

        const updates = {};
        phases.forEach(phase => {
            const checkbox = document.getElementById(phase.id);
            const timestampSpan = document.getElementById(`${phase.id}-timestamp`);
            if (checkbox.checked) {
                checkbox.parentElement.classList.add('completed');
                const timestamp = new Date().toLocaleString();
                timestampSpan.textContent = `Completed at: ${timestamp}`;
                updates[phase.id] = timestamp;
            } else {
                checkbox.parentElement.classList.remove('completed');
                timestampSpan.textContent = '';
            }
        });

        // Save the completed phases and their timestamps to localStorage
        localStorage.setItem('phases', JSON.stringify(updates));

        // Display popup
        popup.classList.remove('hidden');
    });

    closePopup.addEventListener('click', function() {
        popup.classList.add('hidden');
        // Reload the page to keep the updated states visible
        window.location.reload();
    });
});
function goBack() {
    // Logic to navigate back to the previous page
    window.history.back();
}
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
