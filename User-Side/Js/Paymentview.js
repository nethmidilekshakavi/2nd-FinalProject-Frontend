$(document).ready(function () {
    loadPayments(); // Load payments when the page is ready

    // Function to load payment data
    function loadPayments() {
        $.ajax({
            url: "http://localhost:8080/api/payment",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (data) {
                let tbody = $("#paymentViewTable").empty(); // Clear previous data
                data.forEach(payment => {
                    let isCompleted = payment.status === "COMPLETED";  // Check if payment is completed
                    let buttonText = isCompleted ? "Completed Payment" : "Assign Driver";
                    let buttonStyle = isCompleted
                        ? "background-color: #28a745; cursor: default;"
                        : "background-color: #007bff; cursor: pointer;";
                    let buttonDisabled = isCompleted ? "disabled" : "";

                    tbody.append(`
                        <tr>
                            <td style="text-align: center;">${payment.id}</td>
                            <td style="text-align: center;">${payment.user}</td>
                            <td style="text-align: center;">${payment.bookingId}</td>
                            <td style="text-align: center;">${payment.amount}</td>
                            <td style="text-align: center;">${payment.paymentMethod}</td>
                            <td style="text-align: center;">${payment.date}</td>
                            <td style="text-align: center;">
                                <button class="btn btn-payment" 
                                        style="color: #fff; ${buttonStyle} border: none; padding: 5px 10px; border-radius: 4px;" 
                                        data-payment-id="${payment.id}" 
                                        data-user-id="${payment.user}" 
                                        ${buttonDisabled}>
                                    ${buttonText}
                                </button>
                            </td>
                        </tr>
                    `);
                });

                // Add click handler for the payment button
                $(".btn-payment").click(function () {
                    let paymentId = $(this).data("payment-id");
                    let userId = $(this).data("user-id");

                    $("#paymentId").val(paymentId);
                    $("#userId").val(userId);

                    loadDriverList(); // Load driver list for assignment
                    openModal(); // Show the modal
                });
            },
            error: function (xhr, status, error) {
                console.error("Error loading payments:", xhr.responseText || error || status);
                alert("Error loading payments!");
            }
        });
    }

    // Function to load driver list
    function loadDriverList() {
        $.ajax({
            url: "http://localhost:8080/api/d1/drivers",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (drivers) {
                let driverSelect = $("#driverSelect").empty().append('<option value="">-- Select Driver --</option>');
                drivers.forEach(driver => {
                    driverSelect.append(`<option value="${driver.id}">${driver.id}</option>`);
                });
            },
            error: function (xhr) {
                alert("Error loading drivers");
            }
        });
    }

    // Function to open the modal
    function openModal() {
        $("#assignDriverModal").show();
    }

    // Close the modal
    window.closeModal = function () {
        $("#assignDriverModal").hide();
    };

    // Handle form submission for assigning driver
    $("#assignDriverForm").submit(function (e) {
        e.preventDefault();

        // Collect data from modal fields
        const assignedDriverData = {
            payment: $("#paymentId").val(),
            user: $("#userId").val(),
            driver: $("#driverSelect").val(),
            assignedDate: new Date().toISOString().split('T')[0]
        };

        $.ajax({
            url: "http://localhost:8080/api/b1/addDriver",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(assignedDriverData),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function () {
                alert("Driver assigned successfully!");
                closeModal();

                // Find the button that triggered the modal (using paymentId)
                let paymentId = $("#paymentId").val();

                // Find the button with that paymentId
                const btn = $(`.btn-payment[data-payment-id="${paymentId}"]`);

                // Update the button text, color and disable it
                btn.text("Completed Payment")
                    .css({
                        "background-color": "#28a745",
                        "cursor": "default"
                    })
                    .prop("disabled", true); // Disable the button after success
            },
            error: function (xhr, status, error) {
                console.error("Error assigning driver:", xhr.responseText || error || status);
                alert("Error assigning driver!");
            }
        });
    });
});
