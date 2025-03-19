$(document).ready(function () {
   loadDrivers()

    // Load all vehicles
    function loadDrivers() {
        $.ajax({
            url: "http://localhost:8080/api/d1/drivers",  // Ensure this matches backend
            type: "GET",
            success: function (data) {
                let tbody = $("#DriversTableBody").empty();
                data.forEach(allDrivers => {
                    tbody.append(`
                        <tr>
                           <td>${allDrivers.id}</td>
                            <td>${allDrivers.name}</td>
                            <td>${allDrivers.licenseNumber}</td>
                            <td>${allDrivers.phoneNumber}</td>
                            <td>${allDrivers.licenseExpiry}</td>
                      
                            <td>${allDrivers.isAvailable}</td>
                            <td>
                                <img src="data:image/jpeg;base64,${allDrivers.image}" 
                                    alt="Vehicle Image" class="crop-image" 
                                    style="width: 70px; cursor: pointer;">
                            </td>
                             <td>
                                <button class="btn btn-update"  data-driver-id="${allDrivers.id}">Update</button>
                               <button class="btn btn-delete" data-driver-id="${allDrivers.id}">Delete</button>

                            </td>
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error loading vehicles:", xhr.responseText || error || status);
                alert("Error loading vehicles!");
            }
        });
    }

    $("#driverForm").submit(function (e){
        e.preventDefault()

        let drivers = new FormData();

        drivers.append('id',$("#id").val());
        drivers.append('name',$("#name").val());
        drivers.append('licenceNumber',$("#licenseNumber").val());
        drivers.append('phoneNumber',$("#phoneNumber").val());
        drivers.append('expiry',$("#licenseExpiry").val());
        drivers.append('type',$("#vehicleType").val());
        drivers.append('available',$("#isAvailable").val());

        drivers.append("driverData",JSON.stringify(drivers))

        const  imageFile = $("#imagedriver")[0].files[0];
        if (!imageFile){
            alert(("Please select an Image!.."))
            return;
        }

        drivers.append("image",imageFile);

        for (let pair of drivers.entries()){
            console.log(pair[0] + ':' + pair[1])
        }

        if (!$("#id").val() || !$("#name").val() || !$("#licenseNumber").val() ||
            !$("#phoneNumber").val() || !$("#licenseExpiry").val() || !$("#vehicleType").val() ||
            !$("#isAvailable").val()) {
            alert("Please fill in all fields!");
            return;
        }

        $.ajax({

            url:"http://localhost:8080/api/d1/drivers",
            type: "POST",
            data:drivers,
            contentType:false,
            processData:false,
            success:function (){

                alert("Drivers add successFully");
                loadDrivers()
                $("#driverForm")[0].reset();
                closeModal("addDriverForm");
            },
            error: function (xhr, status, error) {
                alert("Error adding drivers: " + (xhr.responseText || error || status));
            }
        })
    })

    window.closeModal = function (modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    $(document).on("click", ".btn-update", function () {
        const driverId = $(this).data("driver-id");
        console.log(driverId)
        if (driverId) {
            loadDriverDataIntoUpdateForm(driverId);
        }
    });

    function loadDriverDataIntoUpdateForm(driverId) {
        $.ajax({
            url: `http://localhost:8080/api/d1/drivers/${driverId}`,
            type: "GET",
            success: function (driverData) {

                if (!driverData || typeof driverData !== "object") {
                    alert("Driver data not found for ID: " + driverId);
                    return;
                }


                $("#updateid").val(driverId);
                $("#updatename").val(driverData.name || ""); // Handle undefined case
                console.log(driverData.name)
                $("#licenseNumber").val(driverData.licenseNumber);
                $("#phoneNumber").val(driverData.phoneNumber);
                $("#licenseExpiry").val(driverData.licenseExpiry);
                $("#vehicleType").val(driverData.vehicleType);
                $("#isAvailable").val(driverData.isAvailable);
                $("#imagedriver").val(driverData.image);


              $("#UpdateDriverModel").show();



            },
            error: function (xhr, status, error) {
                alert("Error loading car details: " + (xhr.responseText || error || status));
            }
        });
    }


    $("#UpdateDriverModel").submit(function (e){
        e.preventDefault()

        const  driverId = $("#updateid").val();
        if (!driverId){
            alert(("Driver ID is Missing"))
            return;
        }

        const driverUpdate = new FormData();


        driverUpdate.append('name',$("#updatename").val());
        driverUpdate.append('licenceNumber',$("#updatelicenseNumber").val());
        driverUpdate.append('phoneNumber',$("#updatephoneNumber").val());
        driverUpdate.append('expiry',$("#updatelicenseExpiry").val());
        driverUpdate.append('type',$("#updatevehicleType").val());
        driverUpdate.append('available',$("#updateisAvailable").val());


        let imageFile = $('#updateimagedriver')[0].files[0];
        if (imageFile) {
            driverUpdate.append('image', imageFile);
        }

        $.ajax({

            url:`http://localhost:8080/api/d1/drivers/${driverId}`,
            type:"PUT",
            data:driverUpdate,
            contentType: false,
            processData: false,
            success:function (){
                alert('Driver updated successfully');
                loadDrivers()
                $("#driverFormUpdate")[0].reset()
                closeModal('UpdateDriverModel');
            },
            error: function (xhr, status, error) {
                alert("Error updating Driver: " + (xhr.responseText || error || status));
            }

        })

    })


    $(document).on("click", ".btn-delete", function () {
        const driverId = $(this).data("driver-id");
        if (confirm("Are you sure you want to delete this driver?")) {
            deleteDriver(driverId);
        }
    });

    function deleteDriver(driverId) {
        $.ajax({
            url: `http://localhost:8080/api/d1/drivers/${driverId}`,
            type: "DELETE",
            success: function () {
                alert("Driver deleted successfully!");
                loadDrivers();
            },
            error: function (xhr, status, error) {
                alert("Error deleting driver: " + (xhr.responseText || error || status));
            }
        });
    }

});