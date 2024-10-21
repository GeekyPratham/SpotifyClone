document.getElementById('signInForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create the data object to send
    const formData = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://127.0.0.1:8080/admin/signin', {
            method: "POST", // Ensure POST method is used
            headers: {
                'Content-Type': 'application/json' // Sending JSON data
            },
            body: JSON.stringify(formData) // Convert form data to JSON
        });

        if (response.ok) {
            const data = await response.json();
            alert('Signin successful!');

            // Handle the response from the backend
            console.log(data);

            // If the backend returns a token, store it in localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }

            // Optionally, redirect the user to a dashboard page after successful login
            window.location.href = 'index.html';
        } else {
            // Handle failed sign-in
            throw new Error('Signin failed! Check your credentials.');
        }
    } catch (error) {
        console.error("Error during signin:", error);
        alert('There was an error with the signin.');
    }
});
