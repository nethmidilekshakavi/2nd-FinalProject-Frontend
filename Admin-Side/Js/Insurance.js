$(document).ready(function () {
    loadInsurance();

    let selectedInsuranceId = null;

    function loadInsurance() {
        $.ajax({
            url: "http://localhost:8080/api/i1/insurance",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (data) {
                let tbody = $("#InsuranceTableBody").empty();
                data.forEach(insurance => {
                    tbody.append(`
                        <tr>
                            <td>${insurance.id}</td>
                            <td>${insurance.provider}</td>
                            <td>${insurance.expiryDate}</td>
                            <td>${insurance.insuranceCost}</td>
                             <td>
                                <button style="color: #ffa500" class="btn btn-update-insurance" data-insurance-id="${insurance.id}"><i class="fas fa-edit"></i></button>
                                <button style="color: red" class="btn btn-delete-insurance" data-insurance-id="${insurance.id}"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function () {
                alert("Error loading Insurance!");
            }
        });
    }

    // Handle form submission (Add or Update insurance)
    $("#InsuranceForm").submit(function (event) {
        event.preventDefault();

        const insurance = {
            id: $("#insuranceId").val().trim(),
            provider: $("#provider").val().trim(),
            expiryDate: $("#expiryDate").val().trim(),
            insuranceCost: $("#insuranceCost").val().trim()
        }

        // Validate fields
        if (!insurance.id || !insurance.provider || !insurance.expiryDate || !insurance.insuranceCost) {
            alert("Please fill in all fields!");
            return;
        }

        if (selectedInsuranceId) {

            $.ajax({
                url: `http://localhost:8080/api/i1/insurance/${selectedInsuranceId}`,
                type: "PUT",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                },
                contentType: "application/json",
                data: JSON.stringify(insurance),

                success: function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Insurance added successfully',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        loadInsurance();
                        $("#")[0].reset();
                        closeModal('insuranceModal');
                    });
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Error adding insurance: ' + (xhr.responseText || error || status),
                        confirmButtonText: 'OK'
                    });
                }
            })
            // Add Insurance
            $.ajax({
                url: "http://localhost:8080/api/i1/insurance",
                type: "POST",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                },
                contentType: "application/json",
                data: JSON.stringify(insurance),
                success: function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Insurance added successfully',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        loadInsurance();
                        $("#InsuranceForm")[0].reset();
                        closeModal('insuranceModal');
                    });
                },error: function (xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Error adding insurance: ' + (xhr.responseText || error || status),
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });

});
