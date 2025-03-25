
$('#signInForm').on('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const email = $('#email').val();
    const password = $('#password').val();

    const signInDTO = {
        email:email,
        password:password
    }

    $.ajax({
        url: 'http://localhost:8080/api/Login/auth/signIn',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(signInDTO),
        success: function (response) {
            console.log(response)
            localStorage.setItem('jwtToken', response.tokens);
            window.location.href = 'index.html';
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "Login failed. Try again.";
            $('#responseMessage').text(errorMessage).css("color", "red").show();
        }
    });
});
