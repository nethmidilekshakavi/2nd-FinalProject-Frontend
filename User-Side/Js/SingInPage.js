$('#signInForm').on('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const email = $('#email').val();
    const password = $('#password').val();

    const signInDTO = {
        email: email,
        password: password
    }

    $.ajax({
        url: 'http://localhost:8080/api/Login/auth/signIn',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(signInDTO),
        success: function (response) {
            console.log(response);
            localStorage.setItem('jwtToken', response.tokens);

            $('body').attr('data-user-id', response.userId);

            // SweetAlert with animation and icon
            Swal.fire({
                title: `🎉 Welcome, ${response.userName}!`,
                text: "You have successfully logged in.",
                icon: "success",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
               // backdrop: `rgba(0, 0, 0, 0.6) url("https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif") center top no-repeat`
            }).then(() => {
                // Redirect based on role
                if (response.role === 'ADMIN') {
                    window.location.href = "admin.html";
                } else if (response.role === 'USER'){
                    window.location.href = "index.html";
                }
            });
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "Login failed. Try again.";

            Swal.fire({
                title: "❌ Login Failed!",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Try Again",
                confirmButtonColor: "#d33",
                backdrop: `rgba(255, 0, 0, 0.5) url("https://media.giphy.com/media/3o6ZsZKnL3JrF1efFe/giphy.gif") center top no-repeat`
            });
        }

    });

});
