function showPhaseDetails() {
    const projectId = document.getElementById('projectId').value;
    const projectTitle = document.getElementById('projectTitle').value;
    const teamLead = document.getElementById('teamLead').value;

    // Update the summary section
    document.getElementById('summaryProjectId').textContent = projectId;
    document.getElementById('summaryProjectTitle').textContent = projectTitle;
    document.getElementById('summaryTeamLead').textContent = teamLead;

    // Show phase details section
    document.getElementById('project-info-form').style.display = 'none';
    document.getElementById('phase-details').style.display = 'block';
}
document.getElementById('project-info-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    
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
            console.log(data.projectId)
            // Store the MongoDB _id in the frontend state
            //localStorage.setItem('projectMongoId', _id);
            localStorage.setItem('projectMongoId', data._id);
                showPhaseDetails();
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


document.getElementById('projectmamu').addEventListener('submit', async function(event) {
    console.log("hi")
    event.preventDefault();
    const id=localStorage.getItem('projectMongoId')
    console.log(id)
    // Collect all phase details
    const phases = [];
    for (let i = 1; i <= 6; i++) {
        const name = `Phase ${i}`; // Phase name, adjust as needed
        const monitor = document.getElementById(`phase${i}Monitor`).value;
        const deadline = document.getElementById(`phase${i}Deadline`).value;
        phases.push({ name, monitor,deadline });
    }
    console.log("hi")
    const projectId = document.getElementById('projectId').value;

    try {
        const response = await fetch(`http://localhost:3000/api/v1/phases/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ projectId, phases })
        });

        if (response.ok) {
            alert('Phases created successfully');
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
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

document.getElementById('submit').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'flex';
});

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

document.getElementById('back-button').addEventListener('click', function() {
    document.getElementById('project-details').style.display = 'none';
    document.getElementById('initial-details').style.display = 'block';
});
document.getElementById('goBak').addEventListener('click', function (event) {
    event.preventDefault();
    // Add your validation logic here (if any)
    // Redirect to dashboard.html
    window.location.href = 'pmi.html';
});
