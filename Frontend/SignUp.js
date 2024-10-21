document.getElementById("signUpForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
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
        username: username,
        email: email,
        password: password
    };

    console.log("Submitting data:", formData);  // Log the data being sent

    try {
        const response = await fetch('http://127.0.0.1:8080/admin/signup', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(formData)
        });
        

        console.log("Response status:", response.status);  // Log response status

        if (response.ok) {
            const data = await response.json();
            alert('Signup successful!');
            console.log(data); // Handle the response from the backend
            window.location.href = "./signin.html"
        } else {
            throw new Error('Signup failed!');
        }
    } catch (error) {
        console.error("Error during signup:", error);
        alert('There was an error with the signup.');
    }
});
