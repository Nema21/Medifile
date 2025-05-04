// Signup Functionality
document.getElementById('signupForm').onsubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic validation
    if (password !== confirmPassword) {
        document.getElementById('signupErrorMsg').innerText = "Passwords do not match!";
        document.getElementById('signupErrorMsg').style.display = 'block';
        return;
    }

    // Store user details in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if the email already exists
    if (users.some(user => user.email === email)) {
        document.getElementById('signupErrorMsg').innerText = "Email already exists!";
        document.getElementById('signupErrorMsg').style.display = 'block';
        return;
    }

    // Add new user
    users.push({ email: email, password: password });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Sign-up successful! You can now log in.");
    document.getElementById('signupForm').reset();
    document.getElementById('toggleForm').click(); // Switch to login form
};

// Combined Login Functionality
document.getElementById('loginForm').onsubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the email and password match any user
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert("Login Successfully");
        window.location.href = "index.html"; 
    } else {
        document.getElementById('errorMsg').innerText = "Invalid email or password.";
        document.getElementById('errorMsg').style.display = "block";
    }
};
window.onload = function() {
    const loginContainer = document.getElementById('loginFormContainer');
    const signupContainer = document.getElementById('signupFormContainer');
    const toggleMessage = document.getElementById('toggleMessage');
    const toggleButton = document.getElementById('toggleForm');

    // Check the initial display state of the forms
    if (signupContainer.style.display === 'block') {
        toggleMessage.innerText = "Already have an account?";
        toggleMessage.style.display = "block"; // Show the message
        toggleButton.innerText = 'Login';
    } else {
        toggleMessage.innerText = "Sign up to Medifile";
        toggleMessage.style.display = "block"; // Show the message
        toggleButton.innerText = 'Sign Up';
    }

    toggleButton.onclick = function() {
        if (loginContainer.style.display === 'none') {
            // Switch to login
            loginContainer.style.display = 'block';
            signupContainer.style.display = 'none';
            toggleButton.innerText = 'Sign Up'; // Update button text
            toggleMessage.innerText = "Sign up to Medifile";
        } else {
            // Switch to sign up
            loginContainer.style.display = 'none';
            signupContainer.style.display = 'block';
            toggleButton.innerText = 'Login'; // Update button text
            toggleMessage.innerText = "Sign up to Medifile";
        }

        // Show the toggle message
        toggleMessage.style.display = "block"; // Set to block to make it visible
    };
};