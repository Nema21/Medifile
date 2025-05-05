const recentPatients = [];
const patientRecords = [];
const diagnosisCount = {male: {}, female: {}};
const departmentCount = {male: {}, female: {}};
const monthlyCounts = {male: Array(12).fill(0), female: Array(12).fill(0);
let currentPatientIndex = null;

function saveSettings() {
    const selectedTheme = document.querySelector('input[name="theme-mode"]:checked').value;

    // Change header, nav, and footer colors based on the selected theme
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');

     if (selectedTheme === 'dark') {
        header.style.backgroundColor = 'rgba(20, 20, 20, 0.9)'; // Darker header background
        nav.style.backgroundColor = 'rgba(20, 20, 20, 0.9)'; // Darker nav background
        footer.style.backgroundColor = 'rgba(20, 20, 20, 0.9)'; // Darker footer background
        header.style.color = '#ffffff'; // Light text
        nav.style.color = '#ffffff'; // Light text
        footer.style.color = '#ffffff'; // Light text

        // Save the theme to localStorage
        localStorage.setItem('theme', 'dark');

    } else if (selectedTheme === 'auto') {
        // Restore original colors for auto mode
        document.body.style.backgroundColor = ''; // Reset to default
        document.body.style.color = ''; // Reset to default

        header.style.backgroundColor = 'rgba(53, 66, 74, 0.9)'; // Original header background
        nav.style.backgroundColor = 'rgba(53, 66, 74, 0.9)'; // Original nav background
        footer.style.backgroundColor = 'rgba(53, 66, 74, 0.9)'; // Original footer background
        header.style.color = '#ffffff'; // Light text
        nav.style.color = '#ffffff'; // Light text
        footer.style.color = '#ffffff'; // Light text

        // Save the theme to localStorage
        localStorage.setItem('theme', 'auto');
    }
    
}

// Function to load the theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const themeRadio = document.querySelector(`input[name="theme-mode"][value="${savedTheme}"]`);
        if (themeRadio) {
            themeRadio.checked = true; // Set the radio button as checked
            saveSettings(); // Apply the saved settings
        }
    }
}

// Call loadTheme on page load
window.onload = function() {
    loadTheme(); // Load the theme
    const storedPatients = JSON.parse(localStorage.getItem('patients'));
    if (storedPatients) {
        storedPatients.forEach(patient => {
            patientRecords.push(patient);
            recentPatients.push(patient);
        });
        updateRecentPatients();
        updatePatientRecords();
        storedPatients.forEach(patient => {
            updateCounts(patient.diagnosis, patient.department, patient.date);
        });
    }
};

document.getElementById('patientForm').onsubmit = function(event) {
    event.preventDefault();
    const patientRecord = {
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        department: document.getElementById('department').value,
        birthdate: document.getElementById('birthdate').value,
        contact: document.getElementById('contact').value,
        complaints: document.getElementById('complaints').value,
        medication: document.getElementById('medication').value,
        diagnosis: document.getElementById('diagnosis').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        doctorName: document.getElementById('doctorName').value,
        doctorContact: document.getElementById('doctorContact').value
    };

    if (currentPatientIndex !== null) {
        // Update existing record
        patientRecords[currentPatientIndex] = patientRecord;
    } else {
        // Add new record
        recentPatients.push(patientRecord);
        patientRecords.push(patientRecord);
    }

    // Update local storage
    localStorage.setItem('patients', JSON.stringify(patientRecords));

    // Refresh the displayed records
    updateRecentPatients();
    updatePatientRecords();

    closeModal();
    document.getElementById('patientForm').reset();
    currentPatientIndex = null;
};

function updateCounts(diagnosis, department, date) {
    diagnosisCount[diagnosis] = (diagnosisCount[diagnosis] || 0) + 1;
    departmentCount[department] = (departmentCount[department] || 0) + 1;
    const recordDate = new Date(date);
    monthlyCounts[recordDate.getMonth()] += 1;
    
    if(gender==='male'){
        diagnosisCount.male[diagnosis]=(diagnosisCount.male[diagnosis] || 0)+1;
        departmentCount.male[department]=(departmentCount.male[department] || 0)+1;
        const recordDate = new Date(date);
        monthlyCounts.male[recordDate.getMonth()]+1=;
    }else if (gender==='female'){
        diagnosisCount.female[diagnosis]=(diagnosisCount.female[diagnosis] || 0)+1;
        departmentCount.female[department]=(departmentCount.female[department] || 0)+1;
        const recordDate = new Date(date);
        monthlyCounts.female[recordDate.getMonth()]+1=;
    }
    
    updateDiagnosisCount();
    updateDepartmentCount();
    updateMonthlyTotals();
    updateYearlyTotal();
}

function updateRecentPatients() {
    const tbody = document.getElementById('recentPatients');
    tbody.innerHTML = '';
    recentPatients.forEach(patient => {
        tbody.innerHTML += `<tr><td>${patient.name}</td><td>${patient.department}</td><td>${patient.date}</td></tr>`;
    });
}

function updatePatientRecords() {
    const tbody = document.getElementById('patientRecords');
    tbody.innerHTML = '';
    patientRecords.forEach((patient, index) => {
        tbody.innerHTML += `<tr>
            <td>${patient.name}</td>
            <td>${patient.department}</td>
            <td>${patient.complaints}</td>
            <td><button onclick="viewRecord(${index})">View</button></td>
        </tr>`;
    });
}

function viewRecord(index) {
    const patient = patientRecords[index];
    currentPatientIndex = index;
    const details = `
        <strong>Name:</strong> ${patient.name}<br>
        <br>
        <strong>Gender:</strong> ${patient.gender}<br>
        <br>
        <strong>Department:</strong> ${patient.department}<br>
        <br>
        <strong>Birthdate:</strong> ${patient.birthdate}<br>
        <br>
        <strong>Contact:</strong> ${patient.contact}<br>
        <br>
        <strong>Complaints:</strong> ${patient.complaints}<br>
        <br>
        <strong>Medication:</strong> ${patient.medication}<br>
        <br>
        <strong>Diagnosis:</strong> ${patient.diagnosis}<br>
        <br>
        <strong>Date:</strong> ${patient.date}<br>
        <br>
        <strong>Time:</strong> ${patient.time}<br>
        <br>
        <strong>Doctor's Name:</strong> ${patient.doctorName}<br>
        <br>
        <strong>Doctor's Contact:</strong> ${patient.doctorContact}<br>
    `;
    document.getElementById('recordDetails').innerHTML = details;
    document.getElementById('recordModal').style.display = 'flex';
}

function closeRecordModal() {
    document.getElementById('recordModal').style.display = 'none';
}

function editRecord() {
    if (currentPatientIndex !== null) {
        const patient = patientRecords[currentPatientIndex];
        document.getElementById('name').value = patient.name;
        document.getElementById('gender').value = patient.gender;
        document.getElementById('department').value = patient.department;
        document.getElementById('birthdate').value = patient.birthdate;
        document.getElementById('contact').value = patient.contact;
        document.getElementById('complaints').value = patient.complaints;
        document.getElementById('medication').value = patient.medication;
        document.getElementById('diagnosis').value = patient.diagnosis;
        document.getElementById('date').value = patient.date;
        document.getElementById('time').value = patient.time;
        document.getElementById('doctorName').value = patient.doctorName;
        document.getElementById('doctorContact').value = patient.doctorContact;

        // Change modal title and button text
        document.getElementById('modalTitle').innerText = 'Edit Patient';
        document.getElementById('submitButton').innerText = 'Update';

        closeRecordModal();
        openModal();
    }
}

function deleteRecord() {
    if (currentPatientIndex !== null) {
        patientRecords.splice(currentPatientIndex, 1); // Remove from records
        recentPatients.splice(currentPatientIndex, 1); // Remove from recent patients
        localStorage.setItem('patients', JSON.stringify(patientRecords));
        updateRecentPatients();
        updatePatientRecords();
        closeRecordModal();
        // Update local storage
        localStorage.setItem('patients', JSON.stringify(patientRecords));

        // Refresh the displayed records
        updateRecentPatients();
        updatePatientRecords();

        // Close the record modal
        closeRecordModal();

        // Reset the currentPatientIndex
        currentPatientIndex = null;
    }
}

function updateDiagnosisCount() {
    const maleDiv = document.getElementById('diagnosisCountMale');
    const femaleDiv = document.getElementById('diagnosisCountFemale');
    const totalDiv = document.getElementById('totalDiagnosisCount');
    
    maleDiv.innerHTML = '<strong>Male:</strong><br>';
    femaleDiv.innerHTML = '<strong>Female:</strong><br>';
    
    let totalMale = 0;
    let totalFemale = 0;

    Object.entries(diagnosisCount.male).forEach(([diagnosis, count]) => {
        maleDiv.innerHTML += `${diagnosis}: ${count}<br>`;
        totalMale += count;
    });

    Object.entries(diagnosisCount.female).forEach(([diagnosis, count]) => {
        femaleDiv.innerHTML += `${diagnosis}: ${count}<br>`;
        totalFemale += count;
    });

    totalDiv.innerHTML = `<strong>Total:</strong> Male: ${totalMale}, Female: ${totalFemale}`;
}

function updateDepartmentCount() {
    const tbody = document.getElementById('departmentCount');
    tbody.innerHTML = '';
    Object.entries(departmentCount).forEach( genderEntry=>{
        const[gender, departments]=genderEntry;
    Object. entries(departments).forEach(([department, count]) => {
        tbody.innerHTML += `<tr><td>${gender.charAt(0).toUpperCase()+gender.slice(1)}-${department}</td><td>${count}</td></tr>`;
    });
    });
}

function updateMonthlyTotals() {
    const tbody = document.getElementById('monthlyTotals');
    tbody.innerHTML = '';
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    ['male','female'].forEach(gender =>{
    monthlyCounts[gender].forEach((count, index) => {
        tbody.innerHTML += `<tr><td>${gender.charAt(0).toUpperCase()+gender.slice(1)}-${monthNames[index]}</td><td>${count}</td></tr>`;
    });
    });



}

function updateYearlyTotal() {
    const yearlyTotal = patientRecords.length;
    document.getElementById('yearlyTotal').innerText = `Total Records This Year: ${yearlyTotal}`;
}

function openModal() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = 'Add Patient';
    document.getElementById('submitButton').innerText = 'Submit';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Navigation functionality
document.querySelectorAll('nav a').forEach(link => {
    link.onclick = function() {
        const sections = ['home', 'patients', 'records'];
        sections.forEach(section => {
            document.getElementById(section).style.display = 'none';
        });
        document.getElementById(this.getAttribute('href').substring(1)).style.display = 'block';
    };
});

function toggleUserInfo() {
    const userInfo = document.getElementById('userInfo');
    userInfo.style.display = userInfo.style.display === 'block' ? 'none' : 'block';
}

function showSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.style.display = 'block'; // Show the settings modal
    } else {
        alert('Settings functionality not implemented yet.');
    }
}
function loadAccounts() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const accountList = document.getElementById('accountList');
    accountList.innerHTML = ''; // Clear previous list

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="radio" name="account" value="${user.email}"> ${user.email}`;
        accountList.appendChild(li);
    });
}
document.getElementById('deleteAccount').onclick = function() {
    const selectedAccount = document.querySelector('input[name="account"]:checked');
    if (!selectedAccount) {
        alert("Please select an account to delete.");
        return;
    }

    const emailToDelete = selectedAccount.value;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Remove the user from the array
    users = users.filter(user => user.email !== emailToDelete);
    localStorage.setItem('users', JSON.stringify(users)); // Update local storage

    alert(`Account ${emailToDelete} deleted successfully.`);
    loadAccounts(); // Refresh the account list
};
function closeSettings() {
    const settingsModal = document.getElementById('settingsModal');
    settingsModal.style.display = 'none'; // Hide the settings modal
}

// Event listener for closing settings modal when clicking outside of it
window.onclick = function(event) {
    const settingsModal = document.getElementById('settingsModal');
    if (event.target === settingsModal) {
        closeSettings();
    }
}

function logout() {
    document.getElementById('userInfo').style.display = 'none';
    alert('Logged out successfully.');
    window.location.href = 'login.html';
}
