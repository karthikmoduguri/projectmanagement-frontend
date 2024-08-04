let selectedProjectId = null; // Global variable to store selected project ID

document.addEventListener('DOMContentLoaded', () => {
    displayProjects();
    hideCreateProjectButton();
});

// Function to get projects from localStorage
function getProjects() {
    return JSON.parse(localStorage.getItem('projects')) || [];
}

// Function to save projects to localStorage
function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Show the overview page
function showOverview() {
    document.getElementById('project-overview').style.display = 'block';
    document.getElementById('project-details').style.display = 'none';
    document.getElementById('create-project').style.display = 'none';
    document.getElementById('progress-bar-container').style.display = 'none';
    document.getElementById('create-project-btn').style.display = 'block'; // Show button on the overview page
}

// Function to fetch project details from the backend
async function fetchProjectDetails(project) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/projects/${project}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (response.ok) {
            console.log(response);
            return await response.json(); // Return the project details
        } else {
            alert('Project not found');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}




async function showProjectDetails() {
    document.getElementById('project-overview').style.display = 'none';
    document.getElementById('project-details').style.display = 'block';
    document.getElementById('create-project').style.display = 'none';
    document.getElementById('progress-bar-container').style.display = 'block';
    document.getElementById('create-project-btn').style.display = 'none'; // Hide button on details page

    if (selectedProjectId) {
        console.log(selectedProjectId);
        const projectId=selectedProjectId
        try {
            const response = await fetch(`http://localhost:3000/api/v1/phases/p/${projectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('projectMongoId', data._id);
                //showProjectDetails(data._id); // Call the function with the MongoDB ID
            } else {
                const error = await response.json();
                throw new Error(`Project fetch error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error fetching project: ${error.message}`);
        }
    } else {
        alert('No project ID specified.');
    }

    const id=localStorage.getItem('projectMongoId');

    const project = await fetchProjectDetails(id);
    console.log(project)
    if (project) {
        let detailsContent = `
            <p><strong>Project ID:</strong> ${project.projectId}</p>
            <p><strong>Project Title:</strong> ${project.projectName}</p>
            <p><strong>Team Lead:</strong> ${project.teamLead}</p>
            <div class="phases-grid">
        `;

        let completedPhases = 0;
        const totalPhases = project.phases.length;
        project.phases.forEach(phase => {
            let phaseClass = '';
            if (phase.status === 'Completed') {
                phaseClass = 'completed';
                completedPhases++;
            } else if (phase.status === 'On Track') {
                phaseClass = 'on-track';
            } else {
                phaseClass = 'not-completed';
            }
            detailsContent += `
                <div class="phase-card ${phaseClass}">
                    <p><strong>Phase:</strong> ${phase.name}</p>
                    <p><strong>Monitor:</strong> ${phase.monitor}</p>
                    <p><strong>Deadline:</strong> ${phase.deadline}</p>
                    <p><strong>Status:</strong> ${phase.status}</p>
                </div>
            `;
        });

        const progressPercentage = (completedPhases / totalPhases) * 100;
        detailsContent += `
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div id="progress-bar" class="progress" style="width: ${progressPercentage}%;"></div>
                </div>
                <span id="progress-percentage">${progressPercentage.toFixed(1)}%</span>
            </div>
        `;

        document.getElementById('details-content').innerHTML = detailsContent;
    }
}


function add() {
    const token = localStorage.getItem('authToken');
    console.log(token);
    document.getElementById('create-project-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        console.log("hi")
        const projectId = document.getElementById('project-id').value;
        const projectName = document.getElementById('project-title').value;
        const teamLead = document.getElementById('team-lead').value;

        // Send login request to backend
        try {
            console.log("hira")
            const response = await fetch('http://localhost:3000/api/v1/projects', { // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ projectId, projectName, teamLead }),
            });

            const data = await response.json();

            // Handle success or error
            if (response.ok) {
                // Store token (if applicable) and redirect
                localStorage.setItem('authToken', data.token); // Store token if received
                window.location.href = 'hoif.html'; // Redirect to another page
            } else {
                document.getElementById('responseMessage').innerText = `Error: ${data.message}`;
            }
        } catch (error) {
            document.getElementById('responseMessage').innerText = 'An error occurred.';
        }
    });
}

// Show the create project page
function showCreateProjectPage() {
    document.getElementById('project-overview').style.display = 'none';
    document.getElementById('project-details').style.display = 'none';
    document.getElementById('create-project').style.display = 'block';
    document.getElementById('progress-bar-container').style.display = 'none';
    document.getElementById('create-project-btn').style.display = 'none'; // Hide button on create project page
}

// Create a new project
function createProject(event) {
    event.preventDefault();
    const projectId = document.getElementById('project-id').value;
    const projectTitle = document.getElementById('project-title').value;
    const teamLead = document.getElementById('team-lead').value;

    const newProject = {
        id: projectId,
        title: projectTitle,
        teamLead: teamLead,
        groupMembers: [],
        phases: [
            { name: 'Ideation and Design', monitor: '', deadline: '', status: 'Pending', timestamp: '' },
            { name: 'Hardware Development', monitor: '', deadline: '', status: 'Pending', timestamp: '' },
            { name: 'Software Integration', monitor: '', deadline: '', status: 'Pending', timestamp: '' },
            { name: 'Design', monitor: '', deadline: '', status: 'Pending', timestamp: '' },
            { name: 'Manufacturing & Production', monitor: '', deadline: '', status: 'Pending', timestamp: '' },
            { name: 'Deployment & Testing', monitor: '', deadline: '', status: 'Pending', timestamp: '' }
        ]
    };

    const projects = getProjects();
    projects.push(newProject);
    saveProjects(projects);
    showOverview();
    displayProjects();
}

// Display all projects on the overview page
function displayProjects() {
    const projects = getProjects();
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        projectsGrid.innerHTML += `
            <div class="project-card" onclick="handleProjectCardClick('${project.id}')">
                <p><strong>Project ID:</strong> ${project.id}</p>
                <p><strong>Project Title:</strong> ${project.title}</p>
                <p><strong>Team Lead:</strong> ${project.teamLead}</p>
            </div>
        `;
    });
}

// Handle clicking on a project card
function handleProjectCardClick(projectId) {
    selectedProjectId = projectId; // Store the selected project ID
    console.log('Selected Project ID:', selectedProjectId); // For debugging
    showProjectDetails(projectId); // Optionally, show project details
}

// Hide the create project button if not on the overview page
function hideCreateProjectButton() {
    document.getElementById('create-project-btn').style.display = 'block'; // Show button on the overview page
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
