function processText() {
    console.log("Processing text...");
    // Validate user input
    var userInput = $("#inputText").val();
    if (userInput.trim() === '' || !userInput.includes('.')) {
        alert("Please enter at least one sentence.");
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/process', // The Flask route for processing
        data: { text: userInput },
        success: function (response) {
            // Handle the server response
            if (response.error) {
                alert('Error: ' + response.error);
            } else {
                // Update the DOM with the result
                document.getElementById('result').innerText = response.result;
            }
        },
        error: function () {
            alert('An error occurred during processing.');
        }
    });
}