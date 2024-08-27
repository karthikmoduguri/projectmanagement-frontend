document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.getElementById('next-button');
    const updateButton = document.getElementById('update-button');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');
    const mainContent = document.getElementById('main-content');
    const enterDetails = document.getElementById('enter-details');
    const workProgress = document.getElementById('work-progress');
    const backButton = document.querySelector('.back-button');

    function showPhaseDetails() {
        const projectId = document.getElementById('project-id').value;
        const projectTitle = document.getElementById('project-title').value;
        const teamLead = document.getElementById('team-lead').value;
    
        // Update the summary section
        document.getElementById('display-project-id').textContent = projectId;
        document.getElementById('display-project-title').textContent = projectTitle;
        document.getElementById('display-team-lead').textContent = teamLead;
    
        // Show phase details section
        document.getElementById('project-form').style.display = 'none';
        document.getElementById('work-progress').style.display = 'block';
    }

    document.getElementById('project-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("hi")
        const projectId = document.getElementById('project-id').value;
        
        try {
            const response = await fetch(`http://localhost:3000/api/v1/phases/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
            if(response.ok){
                const data=await response.json();
                console.log(data._id)
                localStorage.setItem('projectMongoId', data._id);
                console.log("hira")
                showPhaseDetails();
                prefillCheckboxes()
                 // Pre-fill checkboxes based on phase data
            } else {
                const error = await response.json();
                throw new Error(`Project ID fetch error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error fetching project ID: ${error.message}`);
        }
    });
    async function prefillCheckboxes() {
        console.log('prefillCheckboxes function called');
    
        let projectId = localStorage.getItem('projectMongoId');
        if (projectId) {
            try {
                // Fetch project data including phases
                const response = await fetch(`http://localhost:3000/api/v1/projects/k/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Include token if needed
                    }
                });
    
                if (response.ok) {
                    const projectData = await response.json();
                    console.log('Fetched project data:', projectData);
    
                    // Directly use projectData as the phases array
                    const phasesArray = Array.isArray(projectData) ? projectData : [];
                    console.log('Phases Array:', phasesArray);
    
                    // Prefill checkboxes if phases are completed
                    phasesArray.forEach(phase => {
                        const checkbox = document.querySelector(`input[name="${phase.name}"]`);
                        if (checkbox) {
                            checkbox.checked = phase.status === 'completed';
                        }
                    });
                } else {
                    console.error('Error fetching project data:', await response.json());
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        } else {
            console.error('Project ID not found in localStorage');
        }
    }
    
    

    document.getElementById('progress-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const projectId = localStorage.getItem('projectMongoId');
        const token = localStorage.getItem('authToken');

        if (projectId) {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/projects/k/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const projectData = await response.json();
                    const phasesArray = Object.values(projectData);

                    const phaseUpdates = [];
                    const checkboxes = document.querySelectorAll('#progress-form input[type="checkbox"]:checked');

                    checkboxes.forEach(checkbox => {
                        const phaseName = checkbox.name;
                        const phase = phasesArray.find(p => p.name === phaseName);

                        if (phase) {
                            const fileInput = document.getElementById(`${phaseName}-file`);
                            const file = fileInput.files[0];

                            // const formData = new FormData();
                            if (file) {
                                const formData = new FormData();
                                console.log("file came")
                                formData.append('file', file); // Append the file to the form data
                            



                            phaseUpdates.push({
                                phaseId: phase._id,
                                formData: formData,
                                status: 'completed',
                                completionDate: new Date().toLocaleString(),
                                isOnTime: true 
                            });
                        }
                        }
                    });

                    for (const update of phaseUpdates) {
                        const updateResponse = await fetch(`http://localhost:3000/api/v1/phases/u/${update.phaseId}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            body: update.formData
                        });

                        const updateResponse2 = await fetch(`http://localhost:3000/api/v1/phases/${update.phaseId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}` // Include token if needed
                            },
                            body: JSON.stringify({
                                status: update.status,
                                completionDate: update.completionDate,
                                isOnTime: update.isOnTime
                            })
                        });

                        if (updateResponse.ok) {
                            console.log(`Phase ${update.phaseId} updated successfully`);
                        } else {
                            console.error(`Error updating phase ${update.phaseId}:`, await updateResponse.json());
                        }
                        if (updateResponse2.ok) {
                            console.log(`Phase ${update.phaseId} updated successfully`);
                        } else {
                            console.error(`Error updating phase ${update.phaseId}:`, await updateResponse2.json());
                        }
                    }

                    popup.classList.remove('hidden');
                } else {
                    console.error('Error fetching project data:', await response.json());
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        } else {
            console.error('Project ID not found in localStorage');
        }
    });
    
    
    
    closePopup.addEventListener('click', function() {
        popup.classList.add('hidden');
    });

    function goBack() {
        workProgress.classList.add('hidden');
        enterDetails.classList.remove('hidden');
        backButton.classList.add('hidden');
    }

    window.goBack = goBack;

    document.getElementById('goBak').addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = 'pmi.html';
    });

    console.log("noman");
    
    // Call prefillCheckboxes function after DOM is loaded
    
});


