// Function to fetch projects from the backend
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/projects', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Project added:', result);
            populateProjects(result);
        } else {
            const error = await response.json();
            console.error('Error adding project:', error.message);
            alert('Failed to add project: ' + error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the project.');
    }
}

// Populate project list with data from backend
function populateProjects(projects) {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');
        projectCard.innerHTML = `
            <h3>${project.name}</h3>
            <p>Team Lead: ${project.teamLead}</p>
        `;
        projectCard.onclick = () => showProjectDetails(project);
        projectList.appendChild(projectCard);
    });
}

// Show project details
function showProjectDetails(project) {
    const projectDetails = document.getElementById('project-details');
    projectDetails.innerHTML = `
        <h2>Project Details</h2>
        <p><strong>Project ID:</strong> ${project.id}</p>
        <p><strong>Project Name:</strong> ${project.name}</p>
        <p><strong>Team Lead:</strong> ${project.teamLead}</p>
        <div class="phases">
            ${project.phases.map(phase => `
                <div class="phase">
                    <h4>${phase.name}</h4>
                    <p><strong>Monitor:</strong> ${phase.monitor}</p>
                    <p><strong>time:</strong> ${phase._id}</p>
                    <button onclick="viewReport('${phase._id}')">View Submitted Report</button>
                    <button onclick="verifyPhase('${phase.name}', '${project.id}','${phase._id}')">Verify Phase</button>
                    <button onclick="downloadReport('${phase.name}', '${project.id}')">Download Report</button>
                </div>
            `).join('')}
        </div>
        <button onclick="updateProject('${project.id}')">Update</button>
    `;
    projectDetails.classList.add('active');
}

// View report function
// View report function
function viewReport(phaseId) {
    const reportModal = document.getElementById('report-modal');
    const reportIframe = document.getElementById('report-iframe');
    const reportContent = document.getElementById('report-content');

    // Clear previous content
    reportIframe.style.display = 'none';
    reportContent.innerHTML = '';

    // Fetch the file data from the backend
    fetch(`http://localhost:3000/api/v1/phases/download/${phaseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to retrieve file');
            }
            return response.blob(); // Get the file data as a blob
        })
        .then(blob => {
            const fileType = blob.type;

            if (fileType === 'application/pdf') {
                const fileUrl = URL.createObjectURL(blob);
                reportIframe.src = fileUrl;
                reportIframe.style.display = 'block';
            } else if (fileType.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(blob);
                img.style.width = '100%'; // Adjust as needed
                img.style.maxHeight = '100%'; // Adjust as needed
                reportContent.appendChild(img);
                reportContent.style.display = 'block';
            } else {
                reportContent.innerHTML = `<p>Unsupported file type: ${fileType}</p>`;
                reportContent.style.display = 'block';
            }

            // Display the modal
            reportModal.style.display = 'flex';
        })
        .catch(error => {
            reportContent.innerHTML = `<p>Error loading file: ${error.message}</p>`;
            reportContent.style.display = 'block';
            reportModal.style.display = 'flex';
        });
}

// Close the report modal
document.getElementById('close-report').addEventListener('click', function() {
    document.getElementById('report-modal').style.display = 'none';
});


function testModal() {
    const reportModal = document.getElementById('report-modal');
    reportModal.style.display = 'flex';
}

// Verify phase
function verifyPhase(phaseName, projectId,phaseId) {
    fetch(`http://localhost:3000/api/v1/phases/verify/${phaseId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.isVerified) {
            alert('Report has been verified!');
            // Optionally, update the UI to reflect the verification status
        } else {
            alert('Verification failed.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error verifying report.');
    });
    // Implement phase verification functionality here
    showPopup(`Phase "${phaseName}" of project "${projectId}" successfully verified.`);
}

// Download report
function downloadReport(phaseName, projectId) {
    window.location.href = `/api/projects/${projectId}/phases/${phaseName}/report/download`; // Implement backend route to handle downloading
}

// Update project
function updateProject(projectId) {
    // Implement project update functionality here
    showPopup('Project successfully updated.');
}

// Show a popup message
function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
            <p>${message}</p>
            <button onclick="closePopup()">OK</button>
        </div>
    `;
    document.body.appendChild(popup);
}

function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        document.body.removeChild(popup);
    }
}

// Logout confirmation modal
document.getElementById('logout').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('logout-modal').style.display = 'flex';
});

document.getElementById('confirm-logout').addEventListener('click', function () {
    // Implement logout logic here
    alert('Logging out...');
    document.getElementById('logout-modal').style.display = 'none';
    window.location.href = 'login.html'; // Replace with actual login page URL
});

document.getElementById('cancel-logout').addEventListener('click', function () {
    document.getElementById('logout-modal').style.display = 'none';
});

// Fetch projects from backend on page load
fetchProjects();
