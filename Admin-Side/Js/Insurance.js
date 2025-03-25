$(document).ready(function () {
    loadInsurance();

    let selectedInsuranceId = null;

    function loadInsurance() {
        $.ajax({
            url: "http://localhost:8080/api/i1/insurance",
            type: "GET",
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
                                <button class="btn btn-update-insurance" data-id="${insurance.id}" data-provider="${insurance.provider}" data-expiryDate="${insurance.expiryDate}" data-insuranceCost="${insurance.insuranceCost}">Update</button>
                                <button class="btn btn-delete-insurance" data-id="${insurance.id}">Delete</button>
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
            // Update Insurance
            $.ajax({
                url: `http://localhost:8080/api/i1/insurance/${selectedInsuranceId}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(insurance),
                success: function () {
                    alert('Insurance updated successfully!');
                    closeModal('insuranceModal');
                    loadInsurance();
                },
                error: function () {
                    alert("Error updating Insurance!");
                }
            });
        } else {
            // Add Insurance
            $.ajax({
                url: "http://localhost:8080/api/i1/insurance",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(insurance),
                success: function () {
                    alert("Insurance added successfully!");
                    closeModal('insuranceModal');
                    loadInsurance()
                },
                error: function () {
                    alert("Error adding insurance!");
                }
            });
        }
    });

    // Update form fields when Update button is clicked
    $(document).on("click", ".btn-update", function () {
        selectedInsuranceId = $(this).data("id");
        $("#insuranceId").val($(this).data("id"));
        $("#provider").val($(this).data("provider"));
        $("#expiryDate").val($(this).data("expiryDate"));
        $("#insuranceCost").val($(this).data("insuranceCost"));
    });

    // Modal close function
    function closeModal(modalId) {
        $("#" + modalId).modal("hide"); // Bootstrap modal method to hide the modal
    }
});
