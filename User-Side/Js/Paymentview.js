$(document).ready(function () {
    loadPayments();

    function loadPayments() {
        $.ajax({
            url: "http://localhost:8080/api/payment",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (data) {
                let tbody = $("#paymentViewTable").empty();
                data.forEach(payment => {
                    let isCompleted = payment.status === "COMPLETED";
                    let buttonText = payment.status === "COMPLETED" ? "Completed Payment" : "Assign Driver";
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

                $(".btn-payment").click(function () {
                    let paymentId = $(this).data("payment-id");
                    let userId = $(this).data("user-id");

                    $("#paymentId").val(paymentId);
                    $("#userId").val(userId);

                    loadDriverList();
                    openModal();
                });
            },
            error: function (xhr, status, error) {
                console.error("Error loading payments:", xhr.responseText || error || status);
                Swal.fire("Error", "Error loading payments!", "error");
            }
        });
    }

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
                Swal.fire("Error", "Error loading drivers", "error");
            }
        });
    }

    function openModal() {
        $("#assignDriverModal").show();
    }

    window.closeModal = function () {
        $("#assignDriverModal").hide();
    };

    $("#assignDriverForm").submit(function (e) {
        e.preventDefault();

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
                Swal.fire("Success", "Driver assigned successfully!", "success");
                closeModal();

                let paymentId = $("#paymentId").val();

                $.ajax({
                    url: `http://localhost:8080/api/payment/${paymentId}/updateStatus`,
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify({ status: "COMPLETED" }),
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    },
                    success: function () {
                        const btn = $(`.btn-payment[data-payment-id="${paymentId}"]`);
                        btn.text("Completed Payment")
                            .css({
                                "background-color": "#28a745",
                                "cursor": "default"
                            })
                            .prop("disabled", true);
                    },
                    error: function (xhr, status, error) {
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("Error assigning driver:", xhr.responseText || error || status);
                Swal.fire("Error", "Error assigning driver!", "error");
            }
        });
    });
});
