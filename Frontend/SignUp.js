document.getElementById("signUpForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById("age").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("error-message");

    // Clear previous error message
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.style.display = 'block';
        return;
    }

    // Create the data object to send
    const formData = {
        name: name,
        email: email,
        age: age,
        password: password
    };

    try {
        // Correct the URL here to match your backend
        const response = await fetch('http://localhost:4000/signup', { // Update URL here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            alert('Signup successful!');
            console.log(data); // Handle the response from the backend
        } else {
            throw new Error('Signup failed!');
        }
    } catch (error) {
        console.error(error);
        alert('There was an error with the signup.');
    }
});
