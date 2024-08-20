document.addEventListener('DOMContentLoaded', () => {
    const addProjectBtn = document.getElementById('addProjectBtn');
    const removeProjectBtn = document.getElementById('removeProjectBtn');
    const addProjectForm = document.getElementById('addProjectForm');
    const projectForm = document.getElementById('projectForm');
    const projectTableBody = document.getElementById('projectTableBody');
    const projectDetails = document.getElementById('projectDetails');
    const backButton = document.getElementById('backButton');
    const detailsContainer = document.getElementById('detailsContainer');
    const phaseBoxes = document.getElementById('phaseBoxes');
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const projectTable = document.getElementById('projectTable');
    const searchInput = document.getElementById('searchInput');
    let projects = [];

    // Toggle Add Project Form
    addProjectBtn.addEventListener('click', () => {
        addProjectForm.classList.toggle('hidden');
    });

    // Handle Project Form Submission
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const projectId = document.getElementById('projectId').value.trim();
        const projectName = document.getElementById('projectTitle').value.trim();
        const teamLead = document.getElementById('teamLead').value.trim();
        
        if (projectId && projectName && teamLead) {
            const newProject = {
                projectId: projectId,
                projectName: projectName,
                teamLead: teamLead
            };
            
            try {
                const response = await fetch('http://localhost:3000/api/v1/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify(newProject)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Project added:', result);
                    displayProjects(); // Refresh project list
                    addProjectForm.classList.add('hidden');
                    projectForm.reset();
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
    });

    // Handle Remove Project
    removeProjectBtn.addEventListener('click', () => {
        const projectIdToRemove = prompt('Enter Project ID to remove:').trim();
        if (projectIdToRemove) {
            projects = projects.filter(project => project.projectId !== projectIdToRemove);
            displayProjects(); // Refresh project list
        }
    });

    // Handle Edit Project
    function addEditButton(row, project) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            const projectId = prompt('Enter new Project ID:', project.projectId);
            const projectName = prompt('Enter new Project Name:', project.projectName);
            const teamLead = prompt('Enter new Team Lead:', project.teamLead);
            
            if (projectId && projectName && teamLead) {
                project.projectId = projectId;
                project.projectName = projectName;
                project.teamLead = teamLead;
                displayProjects(); // Refresh project list
            }
        });
        const editCell = document.createElement('td');
        editCell.appendChild(editButton);
        row.appendChild(editCell);
    }

    // Show Project Details
    async function showProjectDetails(project) {
        projectTable.classList.add('hidden');
        projectDetails.classList.remove('hidden');

        try {
            const response = await fetch(http://localhost:3000/api/v1/phases/p/${project.projectId}, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Bearer ${localStorage.getItem('authToken')}
                }
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('projectMongoId', data._id);
            } else {
                const error = await response.json();
                throw new Error(Project fetch error: ${error.message});
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert(Error fetching project: ${error.message});
        }
    
        const projectId = localStorage.getItem('projectMongoId');
        const response = await fetch(http://localhost:3000/api/v1/projects/${projectId}, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${localStorage.getItem('authToken')}
            }
        });

        if (response.ok) {
            const projectDetails = await response.json();
            detailsContainer.innerHTML = `
                <h3>Project ID: ${projectDetails.projectId}</h3>
                <p>Title: ${projectDetails.projectName}</p>
                <p>Team Lead: ${projectDetails.teamLead}</p>
            `;
            phaseBoxes.innerHTML = projectDetails.phases.map(phase => `
                <div class="phase-box ${getPhaseClass(phase.status)}" data-phase-id="${phase._id}">
                    <p>${phase.name}</p>
                    <p>Monitor: ${phase.monitor}</p>
                    <p>Deadline: ${phase.deadline ? new Date(phase.deadline).toLocaleDateString('en-IN') : ""}</p>
                    <p><strong>Completion Date:</strong> ${phase.completionDate ? new Date(phase.completionDate).toLocaleDateString('en-IN') : ""}</p>
                    <p>Status: ${phase.status}</p>
                    <p><strong>Is On Time:</strong> ${phase.isOnTime}</p>
                    <p><strong>Submission Time:</strong> ${phase.timeDifference || ""}</p>
                </div>
            `).join('');
            const completedPhases = projectDetails.phases.filter(phase => phase.status === 'completed').length;
            const totalPhases = projectDetails.phases.length;
            const percentage = (completedPhases / totalPhases) * 100;
            progressBar.value = percentage;
            progressPercentage.textContent = ${percentage.toFixed(2)}%;

            // Hover Functionality for Phase Details
            const phaseCells = document.querySelectorAll('#projectTableBody .phase-box');
            phaseCells.forEach(cell => {
                cell.addEventListener('mouseenter', async (event) => {
                    const phaseId = cell.getAttribute('data-phase-id'); // Correctly retrieving the phaseId
                    const { clientX: x, clientY: y } = event; // Get mouse position
                
                    if (phaseId) {
                        try {
                            const phaseResponse = await fetch(http://localhost:3000/api/v1/phases/m/${phaseId}, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': Bearer ${localStorage.getItem('authToken')}
                                }
                            });

                            if (phaseResponse.ok) {
                                const phaseDetails = await phaseResponse.json();
                                showPhaseDetailsPopup(phaseDetails, x, y); // Show popup with phase details
                            } else {
                                console.error('Error fetching phase details');
                            }
                        } catch (error) {
                            console.error('Error fetching phase details:', error);
                        }
                    }
                });
            
                cell.addEventListener('mouseleave', () => {
                    hidePhaseDetailsPopup(); // Hide the popup when the mouse leaves
                });
            });
        } else {
            console.error('Error fetching project details');
            alert('Failed to load project details.');
        }
    }

    // Update Table with Projects
    async function displayProjects() {
        try {
            const response = await fetch('http://localhost:3000/api/v1/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Bearer ${localStorage.getItem('authToken')}
                }
            });

            if (response.ok) {
                projects = await response.json();
                projectTableBody.innerHTML = '';
                projects.forEach((project, index) => {
                    const row = document.createElement('tr');

                    let currentPhaseIndex = project.phases.findIndex(phase => phase.status !== 'completed');
                    if (currentPhaseIndex === -1) currentPhaseIndex = project.phases.length; // If all are completed, no blinking
                    row.innerHTML = `
                      <td>${index + 1}</td>
                      <td>${project.projectId}</td>
                      <td>${project.projectName}</td>
                      <td>${project.teamLead}</td>
                      ${project.phases.length > 0 ? 
                        project.phases.map((phase, phaseIndex) => `
                        <td class="phase-box ${getPhaseClass(phase.status)} ${phaseIndex === currentPhaseIndex ? 'blinking' : ''}" 
                            data-phase-id="${phase._id}">
                            ${phase.status === 'completed' ? '✅' : ''}
                        </td>
                        `).join('') : 
                        '<td colspan="6">!!!Phases not created yet!!! </td>' // Adjust colspan based on your table structure
                    }
                    `;
                    row.addEventListener('click', () => handleProjectClick(project.projectId));

                    // Add the edit button to each row
                    addEditButton(row, project);

                    projectTableBody.appendChild(row);
                });
            } else {
                console.error('Error fetching projects');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Handle Project Click
    function handleProjectClick(projectId) {
        const project = projects.find(p => p.projectId === projectId);
        if (project) {
            showProjectDetails(project);
        }
    }

    // Utility to Determine Phase Class
    function getPhaseClass(status) {
        if (status === 'completed') {
            return 'phase-completed';
        } else if (status === 'ongoing') {
            return 'phase-ongoing';
        } else {
            return 'phase-pending';
        }
    }

    // Search Filter Functionality
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase().trim();
        const filteredProjects = projects.filter(project =>
            project.projectId.toLowerCase().includes(searchValue) ||
            project.projectName.toLowerCase().includes(searchValue) ||
            project.teamLead.toLowerCase().includes(searchValue)
        );
        updateProjectTable(filteredProjects);
    });

    function updateProjectTable(filteredProjects) {
        projectTableBody.innerHTML = '';
        filteredProjects.forEach((project, index) => {
            const row = document.createElement('tr');
            let currentPhaseIndex = project.phases.findIndex(phase => phase.status !== 'completed');
            if (currentPhaseIndex === -1) currentPhaseIndex = project.phases.length; // If all are completed, no blinking
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${project.projectId}</td>
                <td>${project.projectName}</td>
                <td>${project.teamLead}</td>
                ${project.phases.length > 0 ? 
                    project.phases.map((phase, phaseIndex) => `
                    <td class="phase-box ${getPhaseClass(phase.status)} ${phaseIndex === currentPhaseIndex ? 'blinking' : ''}" 
                        data-phase-id="${phase._id}">
                        ${phase.status === 'completed' ? '✅' : ''}
                    </td>
                    `).join('') : 
                    '<td colspan="6">!!!Phases not created yet!!! </td>' // Adjust colspan based on your table structure
                }
            `;
            row.addEventListener('click', () => handleProjectClick(project.projectId));

            // Add the edit button to each row
            addEditButton(row, project);

            projectTableBody.appendChild(row);
        });
    }

    // Fetch projects and populate the table on page load
    displayProjects();
});