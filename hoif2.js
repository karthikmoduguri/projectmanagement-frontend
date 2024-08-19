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
    const searchInput = document.getElementById('searchInput'); // New: Search Input
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
            projectTableBody.innerHTML = '';
        projects.forEach((project, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${project.projectId}</td>
                <td>${project.projectName}</td>
                <td>${project.teamLead}</td>
                  ${project.phases.length > 0 ? 
                project.phases.map(phase => `
                    <td class="phase-box ${getPhaseClass(phase.status)}">
                        ${phase.status === 'completed' ? '✔️' : '❌'}
                    </td>
                `).join('') : 
                '<td colspan="6">!!!Phases not created yet!!! </td>' // Adjust colspan based on your table structure
            }
            `;
            row.addEventListener('click', () => handleProjectClick(project.projectId));
            projectTableBody.appendChild(row);
        });
        }
    });

    // Show Project Details
    async function showProjectDetails(project) {
        projectTable.classList.add('hidden');
        projectDetails.classList.remove('hidden');

        try {
            const response = await fetch(`http://localhost:3000/api/v1/phases/p/${project.projectId}`, {
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
    

            const projectId=localStorage.getItem('projectMongoId');

        
        const response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
                <div class="phase-box ${getPhaseClass(phase.status)}">
                    <p>${phase.name}</p>
                    <p>Monitor: ${phase.monitor}</p>
                    <p>Deadline: ${phase.deadline?new Date(phase.deadline).toLocaleDateString('en-IN'):""}</p>
                    <p><strong>completion date:</strong> ${phase.completionDate?new Date(phase.completionDate).toLocaleDateString('en-IN'):""}</p>

                    <p>Status: ${phase.status}</p>
                    <p><strong>isontime:</strong> ${phase.isOnTime}</p>
                    <p><strong>submission time:</strong> ${phase.timeDifference||""}</p>
                </div>
            `).join('');
            const completedPhases = projectDetails.phases.filter(phase => phase.status === 'completed').length;
            const totalPhases = projectDetails.phases.length;
            const percentage = (completedPhases / totalPhases) * 100;
            progressBar.value = percentage;
            progressPercentage.textContent = `${percentage.toFixed(2)}%`;
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
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                projects = await response.json();
                projectTableBody.innerHTML = '';
                projects.forEach((project, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                      <td>${index + 1}</td>
            <td>${project.projectId}</td>
            <td>${project.projectName}</td>
            <td>${project.teamLead}</td>
            ${project.phases.length > 0 ? 
                project.phases.map(phase => `
                    <td class="phase-box ${getPhaseClass(phase.status)}">
                        ${phase.status === 'completed' ? '✔️' : '❌'}
                    </td>
                `).join('') : 
                '<td colspan="6">!!!Phases not created yet!!! </td>' // Adjust colspan based on your table structure
            }
                    `;
                    row.addEventListener('click', () => handleProjectClick(project.projectId));
                    projectTableBody.appendChild(row);
                });
            } else {
                console.error('Error fetching projects');
                alert('Failed to load projects.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching projects.');
        }
    }

    // Handle Project Click
    function handleProjectClick(projectId) {
        const project = projects.find(p => p.projectId === projectId);
        if (project) {
            showProjectDetails(project);
        } else {
            console.error('Project not found');
            alert('Project not found.');
        }
    }

    // Get Phase Class based on Status
    function getPhaseClass(status) {
        switch (status) {
            case 'Completed': return 'completed';
            case 'On Track': return 'on-track';
            case 'Not Completed': return 'not-completed';
        }
    }

    // Back Button Event
    backButton.addEventListener('click', () => {
        projectTable.classList.remove('hidden');
        projectDetails.classList.add('hidden');
    });

    // New: Search Functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProjects = projects.filter(project => 
            project.projectName.toLowerCase().includes(searchTerm)
        );
        projectTableBody.innerHTML = '';
        filteredProjects.forEach((project, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${project.projectId}</td>
                <td>${project.projectName}</td>
                <td>${project.teamLead}</td>
                ${project.phases.map(phase => `
                    <td class="phase-box ${getPhaseClass(phase.status)}">
                        ${phase.status === 'completed' ? '✔️' : '❌'}
                    </td>
                `).join('')}
            `;
            row.addEventListener('click', () => handleProjectClick(project.projectId));
            projectTableBody.appendChild(row);
        });
    });

    // Initial fetch of projects
    displayProjects();
});