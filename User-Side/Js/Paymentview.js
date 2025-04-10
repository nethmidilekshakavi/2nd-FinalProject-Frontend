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
                    tbody.append(`
                        <tr>
                            <td style="text-align: center;">${payment.id}</td>
                            <td style="text-align: center;">${payment.user}</td>
                            <td style="text-align: center;">${payment.bookingId}</td>
                            <td style="text-align: center;">${payment.amount}</td>
                            <td style="text-align: center;">${payment.paymentMethod}</td>
                            <td style="text-align: center;">${payment.date}</td>
                            <td style="text-align: center;">
                                <button style="color: #ffa500" class="btn btn-payment" 
                                    data-payment-id="${payment.id}" 
                                    data-user-id="${payment.user}">
                                    <i class="fas fa-edit"></i>
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
                loadPayments();
            },
            error: function (xhr, status, error) {
                console.error("Error assigning driver:", xhr.responseText || error || status);
                alert("Error assigning driver!");
            }
        });
    });

})
