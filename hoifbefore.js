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
    removeProjectBtn.addEventListener('input', () =>{
        const projectId=removeProjectBtn.value;
        console.log(projectId)
        removeProject();
        async function removeProject(projectId) {
        
        try{
            const response= await fetch(`http://localhost:3000/api/v1/projects/${projectId}`,{
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
            });
            console.log("yes")
            if(response.ok){
                console.log("panicheysindhi")
                displayProjects();
            }
            else{
                console.error('error removing projects');
            }
        }catch(error){
            console.error('Error:', error.message);
        }
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
    
        const projectId = localStorage.getItem('projectMongoId');
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
                <div class="phase-box ${getPhaseClass(phase.status)}" data-phase-id="${phase._id}">
                    <p>${phase.name}</p>
                    <p>Monitor: ${phase.monitor}</p>
                    <p>Deadline: ${phase.deadline ? new Date(phase.deadline).toLocaleDateString('en-IN') : ""}</p>
                    <p><strong>Completion Date:</strong> ${phase.completionDate ? new Date(phase.completionDate).toLocaleDateString('en-IN') : ""}</p>
                    <p>Status: ${phase.status}</p>
                    <p>Doucment verification: ${phase.isVerified}</p>
                    <p><strong>Is On Time:</strong> ${phase.isOnTime}</p>
                    <p><strong>Submission Time:</strong> ${phase.timeDifference || ""}</p>
                </div>
            `).join('');
            const completedPhases = projectDetails.phases.filter(phase => phase.status === 'completed').length;
            const totalPhases = projectDetails.phases.length;
            const percentage = (completedPhases / totalPhases) * 100;
            progressBar.value = percentage;
            progressPercentage.textContent = `${percentage.toFixed(2)}%`;

            // Hover Functionality for Phase Details
           // Hover Functionality for Phase Details
// Function to display phase details in a popup
// function showPhaseDetailsPopup(details, x, y) {
//     let popup = document.getElementById('phaseDetailsPopup');
    
//     if (popup) {
//         popup.remove(); // Remove existing popup if it exists
//     }

//     // Create the popup div
//     popup = document.createElement('div');
//     popup.id = 'phaseDetailsPopup';
//     popup.style.position = 'absolute';
//     popup.style.left = `${x + 10}px`;
//     popup.style.top = `${y + 10}px`;
//     popup.style.backgroundColor = 'white';
//     popup.style.border = '1px solid black';
//     popup.style.padding = '10px';
//     popup.style.zIndex = '1000';
//     popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';

//     // Fill the popup with phase details
//     popup.innerHTML = `
//         <strong>Phase Name:</strong> ${details.name || 'N/A'}<br>
//         <strong>Monitor:</strong> ${details.monitor || 'N/A'}<br>
//         <strong>Status:</strong> ${details.status || 'N/A'}<br>
//         <strong>Completion Date:</strong> ${details.completionDate ? new Date(details.completionDate).toLocaleDateString('en-IN') : 'N/A'}<br>
//         <strong>Deadline:</strong> ${details.deadline ? new Date(details.deadline).toLocaleDateString('en-IN') : 'N/A'}<br>
//         <strong>Is On Time:</strong> ${details.isOnTime ? 'Yes' : 'No'}<br>
//         <strong>Submission Time:</strong> ${details.timeDifference || 'N/A'}
//     `;

//     // Append the popup to the body
//     document.body.appendChild(popup);
// }

// // Function to hide the popup
// function hidePhaseDetailsPopup() {
//     const popup = document.getElementById('phaseDetailsPopup');
//     if (popup) {
//         popup.remove();
//     }
// }

// // Function to set the blinking effect
// function setBlinkingEffect() {
//     const phaseColumns = document.querySelectorAll('#projectTable td');

//     phaseColumns.forEach((column, index) => {
//         if (column.innerText === '✔') {
//             const nextColumn = phaseColumns[index + 1];
//             if (nextColumn && nextColumn.innerText.trim() === '') {
//                 nextColumn.classList.add('blinking');
//             }
//         }
//     });
// }

// // Event listeners for phase boxes
// const phaseCells = document.querySelectorAll('#projectTableBody .phase-box');

// phaseCells.forEach(cell => {
//     cell.addEventListener('mouseenter', async (event) => {
//         const phaseId = cell.getAttribute('data-phase-id'); // Correctly retrieving the phaseId
//         const { clientX: x, clientY: y } = event; // Get mouse position

//         if (phaseId) {
//             try {
//                 const phaseResponse = await fetch(`http://localhost:3000/api/v1/phases/m/${phaseId}`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//                     }
//                 });

//                 if (phaseResponse.ok) {
//                     const phaseDetails = await phaseResponse.json();
//                     showPhaseDetailsPopup(phaseDetails, x, y); // Show popup with phase details
//                 } else {
//                     console.error('Error fetching phase details');
//                 }
//             } catch (error) {
//                 console.error('Error fetching phase details:', error);
//             }
//         }
//     });

//     cell.addEventListener('mouseleave', () => {
//         hidePhaseDetailsPopup(); // Hide the popup when the mouse leaves
//     });
// });
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

                    function showPhaseDetailsPopup(details, x, y) {
                        let popup = document.getElementById('phaseDetailsPopup');
                        
                        if (popup) {
                            popup.remove(); // Remove existing popup if it exists
                        }
                    
                        // Create the popup div
                        popup = document.createElement('div');
                        popup.id = 'phaseDetailsPopup';
                        popup.style.position = 'absolute';
                        popup.style.left = `${x + 10}px`;
                        popup.style.top = `${y + 10}px`;
                        popup.style.backgroundColor = 'white';
                        popup.style.border = '1px solid black';
                        popup.style.padding = '10px';
                        popup.style.zIndex = '1000';
                        popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
                    
                        // Fill the popup with phase details
                        popup.innerHTML = `
                            <strong>Phase Name:</strong> ${details.name || 'N/A'}<br>
                            <strong>Monitor:</strong> ${details.monitor || 'N/A'}<br>
                            <strong>Status:</strong> ${details.status || 'N/A'}<br>
                            <strong>Completion Date:</strong> ${details.completionDate ? new Date(details.completionDate).toLocaleDateString('en-IN') : 'N/A'}<br>
                            <strong>Deadline:</strong> ${details.deadline ? new Date(details.deadline).toLocaleDateString('en-IN') : 'N/A'}<br>
                            <strong>Is On Time:</strong> ${details.isOnTime ? 'Yes' : 'No'}<br>
                            <strong>Submission Time:</strong> ${details.timeDifference || 'N/A'}
                        `;
                    
                        // Append the popup to the body
                        document.body.appendChild(popup);
                    }
                    
                    // Function to hide the popup
                    function hidePhaseDetailsPopup() {
                        const popup = document.getElementById('phaseDetailsPopup');
                        if (popup) {
                            popup.remove();
                        }
                    }
                    
                    // Function to set the blinking effect
                    function setBlinkingEffect() {
                        const phaseColumns = document.querySelectorAll('#projectTable td');
                    
                        phaseColumns.forEach((column, index) => {
                            if (column.innerText === '✔') {
                                const nextColumn = phaseColumns[index + 1];
                                if (nextColumn && nextColumn.innerText.trim() === '') {
                                    nextColumn.classList.add('blinking');
                                }
                            }
                        });
                    }
                    
                    // Event listeners for phase boxes
                    const phaseCells = document.querySelectorAll('#projectTableBody .phase-box');
                    
                    phaseCells.forEach(cell => {
                        cell.addEventListener('mouseenter', async (event) => {
                            const phaseId = cell.getAttribute('data-phase-id'); // Correctly retrieving the phaseId
                            const { clientX: x, clientY: y } = event; // Get mouse position
                    
                            if (phaseId) {
                                try {
                                    const phaseResponse = await fetch(`http://localhost:3000/api/v1/phases/m/${phaseId}`, {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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




                    row.addEventListener('click', () => handleProjectClick(project.projectId));
                    projectTableBody.appendChild(row);

                    

                });
            } else {
                console.error('Error fetching projects');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Back Button Event
    backButton.addEventListener('click', () => {
        projectDetails.classList.add('hidden');
        projectTable.classList.remove('hidden');
    });

    // Search Functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const rows = projectTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const projectId = row.cells[1].textContent.toLowerCase();
            const projectName = row.cells[2].textContent.toLowerCase();
            const teamLead = row.cells[3].textContent.toLowerCase();

            if (projectId.includes(searchTerm) || projectName.includes(searchTerm) || teamLead.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Fetch projects and populate the table on page load
    displayProjects();
    
    // Get phase box class based on status
    function getPhaseClass(status) {
        return status === 'completed' ? 'completed' : 'not-completed';
    }

    // Handle project row click to show project details
    function handleProjectClick(projectId) {
        const selectedProject = projects.find(project => project.projectId === projectId);
        if (selectedProject) {
            showProjectDetails(selectedProject);
        }
    }
});
