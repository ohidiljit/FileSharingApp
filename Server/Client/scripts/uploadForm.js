document.getElementById("browseOption").addEventListener("click", function() {
    // Trigger the file input when "Browse" button is clicked
    document.getElementById("file").click();
});

document.getElementById("file").addEventListener("change", function() {
    // Automatically submit the form when a file is selected
    if (this.files.length > 0) {
        submitForm(); // Call the function to submit form via fetch
    }
});

// Function to submit the form using fetch (to prevent default form submission)
function submitForm() {
    const formData = new FormData();
    const fileInput = document.getElementById("file");

    // Check if a file is selected
    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]); // Append the selected file to the form data

        // Send the form data to the server using fetch (POST request)
        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // On success, show the modal
                const myModal = new bootstrap.Modal(document.getElementById('successModal'));
                myModal.show();
            }
            console.log("File uploaded:", data);
        })
        .catch(error => {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        });
    } else {
        alert("Please select a file to upload.");
    }
}
