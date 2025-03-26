// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    // Add toggle password visibility functionality
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');

    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordField.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate passwords match
        if (passwordField.value !== confirmPasswordField.value) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match!',
            });
            return;
        }

        const formData = new FormData();

        const userId = Math.floor(Math.random() * 10000);

        formData.append('userId', userId.toString());
        formData.append('fn', document.getElementById('firstName').value);
        formData.append('ln', document.getElementById('lastName').value);
        formData.append('address', document.getElementById('address').value);
        formData.append('number', document.getElementById('phone').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('un', document.getElementById('username').value);
        formData.append('pw', document.getElementById('password').value);

        // Get the file input
        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Hold on!',
                text: 'Please select a profile image.',
            });
            return;
        }

        if (!document.getElementById('terms').checked) {
            Swal.fire({
                icon: 'warning',
                title: 'Hold on!',
                text: 'You must accept the terms and conditions.',
            });
            return;
        }

        fetch('http://localhost:8080/api/v1/user/userSave', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Account Created!',
                        text: 'Your account has been created successfully!',
                        confirmButtonText: 'Sign In',
                    }).then(() => {
                        form.reset();
                        window.location.href = 'SingIn.html'; // Redirect to sign-in page
                    });
                } else if (response.status === 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Input',
                        text: 'Please check your email and other fields.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        text: 'Error creating account. Please try again later.',
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Please check your connection and try again.',
                });
            });
    });

    // Handle social signup buttons (placeholder function)
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            Swal.fire({
                icon: 'info',
                title: 'Coming Soon!',
                text: 'Social signup integration is coming soon!',
            });
        });
    });
});
