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
                //const { _id,dbprojectId} = await response.json();
                console.log(data._id)
                // Store the MongoDB _id in the frontend state
                //localStorage.setItem('projectMongoId', _id);
                localStorage.setItem('projectMongoId', data._id);
                console.log("hira")
                showPhaseDetails()
                
            }
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Project ID fetch error: ${error.message}`);
            }
            // const data=await response.json();
            // //const { _id,dbprojectId} = await response.json();
            // console.log(data.projectId)
            // // Store the MongoDB _id in the frontend state
            // //localStorage.setItem('projectMongoId', _id);
            // localStorage.setItem('projectMongoId', data._id);
            // if(data.projectId==projectId){
            //     showPhaseDetails();
            // }
            const id=localStorage.getItem('projectMongoId')
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error fetching project ID: ${error.message}`);
        }
    });
    


    document.getElementById('progress-form').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const projectId = localStorage.getItem('projectMongoId');
        const token = localStorage.getItem('authToken');
    
        if (projectId) {
            try {
                // Fetch project data including phases
                const response = await fetch(`http://localhost:3000/api/v1/projects/k/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include token if needed
                    }
                });
    
                if (response.ok) {
                    const projectData = await response.json();
                    console.log('Project Data:', projectData);
                    console.log('Phases Data:', projectData.phases);
    
                  
                // const phasesObject = projectData.phases; // Assuming phases is an object
                const phasesArray = Object.values(projectData); // Convert to array of phase objects

                const phaseUpdates = [];
                const checkboxes = document.querySelectorAll('#progress-form input[type="checkbox"]:checked'); // Only selected checkboxes

                checkboxes.forEach(checkbox => {
                    const phaseName = checkbox.name;
                    const phase = phasesArray.find(p => p.name === phaseName);
    
                            if (phase) {
                                phaseUpdates.push({
                                    phaseId: phase._id,
                                    status: 'completed',
                                    completionDate: new Date().toLocaleString(),
                                    isOnTime: true // Adjust based on your logic
                                });
                            }
                        });
                        console.log(phaseUpdates);
                        // Send the phase updates to the server
                        for (const update of phaseUpdates) {
                            console.log('Processing update for phase ID:', update.phaseId);
                            console.log("ayyindha")
                            const updateResponse = await fetch(`http://localhost:3000/api/v1/phases/${update.phaseId}`, {
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
    
                            const result = await updateResponse.json();
                            if (updateResponse.ok) {
                                console.log(`Phase ${update.phaseId} updated successfully:`, result);
                                // Handle success, e.g., show a confirmation message
                                
                            } else {
                                console.error(`Error updating phase ${update.phaseId}:`, result);
                            }
                        }
                    
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
});

// function goBak('click',()=>{
//     window.location.href='';
// })

document.getElementById('goBak').addEventListener('click', function (event) {
    event.preventDefault();
    // Add your validation logic here (if any)
    // Redirect to dashboard.html
    window.location.href = 'pmi.html';
});
