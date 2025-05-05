const recentPatients = [];
const patientRecords = [];
const diagnosisCount = {};
const departmentCount = {};
const monthlyCounts = Array(12).fill(0);
const monthlyGenderCounts = Array.from({ length: 12 }, () => ({ total: 0, male: 0, female: 0 }));
let currentPatientIndex = null;

function saveSettings() {
    const selectedTheme = document.querySelector('input[name="theme-mode"]:checked').value;
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');

    if (selectedTheme === 'dark') {
        header.style.backgroundColor = 'rgba(20, 20, 20, 0.9)';
        nav.style.backgroundColor = 'rgba(20, 20, 20, 0.9)';
        footer.style.backgroundColor = 'rgba(20, 20, 20, 0.9)';
        header.style.color = '#ffffff';
        nav.style.color = '#ffffff';
        footer.style.color = '#ffffff';
        localStorage.setItem('theme', 'dark');
    } else if (selectedTheme === 'auto') {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        header.style.backgroundColor = 'rgba(53, 66, 74, 0.9)';
        nav.style.backgroundColor = 'rgba(53, 66, 74, 0.9)';
        footer.style.backgroundColor = 'rgba(53, 66, 74, 0.9)';
        header.style.color = '#ffffff';
        nav.style.color = '#ffffff';
        footer.style.color = '#ffffff';
        localStorage.setItem('theme', 'auto');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const themeRadio = document.querySelector(`input[name="theme-mode"][value="${savedTheme}"]`);
        if (themeRadio) {
            themeRadio.checked = true;
            saveSettings();
        }
    }
}

window.onload = function() {
    loadTheme();
    const storedPatients = JSON.parse(localStorage.getItem('patients'));
    if (storedPatients) {
        storedPatients.forEach(patient => {
            patientRecords.push(patient);
            recentPatients.push(patient);
            updateCounts(patient.diagnosis, patient.department, patient.date, patient.gender);
        });
        updateRecentPatients();
        updatePatientRecords();
        updateYearlyTotal();
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
        patientRecords[currentPatientIndex] = patientRecord;
    } else {
        recentPatients.push(patientRecord);
        patientRecords.push(patientRecord);
    }

    localStorage.setItem('patients', JSON.stringify(patientRecords));
    updateRecentPatients();
    updatePatientRecords();
    updateCounts(patientRecord.diagnosis, patientRecord.department, patientRecord.date, patientRecord.gender);
    updateYearlyTotal();
    closeModal();
    document.getElementById('patientForm').reset();
    currentPatientIndex = null;
    alert('Saved.');
};

function updateCounts(diagnosis, department, date, gender) {
    // Update Diagnosis Count
    const diagnosisData = diagnosisCount[diagnosis] || { total: 0, male: 0, female: 0 };
    diagnosisData.total++;
    if (gender === 'male') {
        diagnosisData.male++;
    } else if (gender === 'female') {
        diagnosisData.female++;
    }
    diagnosisCount[diagnosis] = diagnosisData;

    // Update Department Count
    const departmentData = departmentCount[department] || { total: 0, male: 0, female: 0 };
    departmentData.total++;
    if (gender === 'male') {
        departmentData.male++;
    } else if (gender === 'female') {
        departmentData.female++;
    }
    departmentCount[department] = departmentData;

    // Update Monthly Counts
    const recordDate = new Date(date);
    monthlyCounts[recordDate.getMonth()]++;

    const monthlyData = monthlyGenderCounts[recordDate.getMonth()] || { total: 0, male: 0, female: 0 };
    monthlyData.total++;
    if (gender === 'male') {
        monthlyData.male++;
    } else if (gender === 'female') {
        monthlyData.female++;
    }
    monthlyGenderCounts[recordDate.getMonth()] = monthlyData;

    updateDiagnosisCount();
    updateDepartmentCount();
    updateMonthlyTotals();
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
        <strong>Gender:</strong> ${patient.gender}<br>
        <strong>Department:</strong> ${patient.department}<br>
        <strong>Birthdate:</strong> ${patient.birthdate}<br>
        <strong>Contact:</strong> ${patient.contact}<br>
        <strong>Complaints:</strong> ${patient.complaints}<br>
        <strong>Medication:</strong> ${patient.medication}<br>
        <strong>Diagnosis:</strong> ${patient.diagnosis}<br>
        <strong>Date:</strong> ${patient.date}<br>
        <strong>Time:</strong> ${patient.time}<br>
        <strong>Doctor's Name:</strong> ${patient.doctorName}<br>
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

        document.getElementById('modalTitle').innerText = 'Edit Patient';
        document.getElementById('submitButton').innerText = 'Update';

        closeRecordModal();
        openModal();
    }
}

function deleteRecord() {
    if (currentPatientIndex !== null) {
        patientRecords.splice(currentPatientIndex, 1);
        recentPatients.splice(currentPatientIndex, 1);
        localStorage.setItem('patients', JSON.stringify(patientRecords));
        updateRecentPatients();
        updatePatientRecords();
        closeRecordModal();
        currentPatientIndex = null;
    }
}

function updateDiagnosisCount() {
    const tbody = document.getElementById('diagnosisCount');
    tbody.innerHTML = '';
    Object.entries(diagnosisCount).forEach(([diagnosis, counts]) => {
        tbody.innerHTML += `
            <tr>
                <td>${diagnosis}</td>
                <td>${counts.total}</td>
                <td>${counts.male}</td>
                <td>${counts.female}</td>
            </tr>`;
    });
}

function updateDepartmentCount() {
    const tbody = document.getElementById('departmentCount');
    tbody.innerHTML = '';
    Object.entries(departmentCount).forEach(([department, counts]) => {
        tbody.innerHTML += `
            <tr>
                <td>${department}</td>
                <td>${counts.total}</td>
                <td>${counts.male}</td>
                <td>${counts.female}</td>
            </tr>`;
    });
}

function updateMonthlyTotals() {
    const tbody = document.getElementById('monthlyTotals');
    tbody.innerHTML = '';
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    monthlyGenderCounts.forEach((counts, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${monthNames[index]}</td>
                <td>${counts.total}</td>
                <td>${counts.male}</td>
                <td>${counts.female}</td>
            </tr>`;
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
        settingsModal.style.display = 'block';
    } else {
        alert('Settings functionality not implemented yet.');
    }
}

function loadAccounts() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const accountList = document.getElementById('accountList');
    accountList.innerHTML = '';

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
    users = users.filter(user => user.email !== emailToDelete);
    localStorage.setItem('users', JSON.stringify(users));

    alert(`Account ${emailToDelete} deleted successfully.`);
    loadAccounts();
};

function closeSettings() {
    const settingsModal = document.getElementById('settingsModal');
    settingsModal.style.display = 'none';
}

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
