/**
 * Processes the user input text by sending it to the server for processing.
 * If the input is empty or does not contain a period, an error message is displayed.
 * Otherwise, an AJAX request is made to the server to process the text.
 * Upon successful response, the result is parsed and tables are created to display the sentences.
 * @returns None
 */
function processText() {
    // Validate user input
    var userInput = $("#inputText").val();
    if (userInput.trim() === '' || !userInput.includes('.')) {
        const errorMessageLabel = document.getElementById('errorMessage');
        errorMessageLabel.textContent = 'Error: Please enter at least one sentence containing a period (.)';
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/process', // The Flask route for processing
        data: { text: userInput },
        success: function (response) {
        
            // Additional handling of the response as needed    
            try {
                // Parse the 'result' property as JSON
                var resultObject = JSON.parse(response.result);
        
                // Access sentences from result
                var sentences = resultObject.sentences;
        
                // Create HTML tables based on the data
                createTables(sentences);
                processResponse(response);
        
            } catch (error) {
                console.error("Error parsing 'result' property:", error);
            }
        },
        error: function () {
            alert('An error occurred during processing.');
        }
    });
}

// Function to create HTML tables based on the data
/**
 * Creates tables to display sentences and their corresponding tokens.
 * @param {Array} sentences - An array of sentences, each containing an array of tokens.
 * @returns None
 */
function createTables(sentences) {
    // Assuming you have a div with the id 'resultContainer' for displaying tables
    var resultContainer = $('#resultContainer');

    // Clear existing table and chart
    resultContainer.empty();

    // Loop through sentences and create tables
    sentences.forEach(function (sentence, index) {
        var tableHTML = '<h5>Sentence ' + (index + 1) + '</h5>';
        tableHTML += '<table>';
        tableHTML += '<tr><th>Index</th><th>Word</th><th>Parts of Speech</th></tr>';

        sentence.tokens.forEach(function (token) {
            // Add background color based on POS
            var posClass = 'pos-' + token.pos;
            var backgroundColor = getBackgroundColor(token.pos);

            tableHTML += '<tr class="' + posClass + '" style="background-color:' + backgroundColor + ';">';
            tableHTML += '<td>' + token.index + '</td>';
            tableHTML += '<td>' + token.word + '</td>';
            tableHTML += '<td>' + token.pos + '</td>';
            tableHTML += '</tr>';
        });

        tableHTML += '</table>';
        resultContainer.append(tableHTML);
    });
}

// Function to get background color based on POS
function getBackgroundColor(pos) {
    // Define colors for each part of speech
    var colors = {
        'NN': '#3366cc',
        'VBN': '#dc3912',
        'DT': '#ff9900',
        'JJ': '#109618',
        'UH': '#990099',
        'VBD': '#0099c6',
        'CC': '#dd4477',
        'RB': '#66aa00',
        'IN': '#b82e2e',
        'WRB': '#316395',
        'VB': '#994499',
        'NNS': '#22aa99',
        'PRP': '#aaaa11',
        'PRP$': '#6633cc',
        'VBP': '#329262'
    };

    return colors[pos] || '#777777'; // Default color if not specified
}


/**
 * Processes the response from an API call and generates a bar graph based on the
 * part-of-speech counts in the response.
 * @param {object} response - The response object from the API call.
 * @returns None
 */
function processResponse(response) {
    try {
        var resultObject = JSON.parse(response.result);
        var sentences = resultObject.sentences;

        // Extract parts of speech and count occurrences
        var posCounts = {};
        sentences.forEach(function (sentence) {
            sentence.tokens.forEach(function (token) {
                var pos = token.pos;
                posCounts[pos] = (posCounts[pos] || 0) + 1;
            });
        });

        // Create a bar graph based on the parts of speech
        createBarGraph(posCounts);

    } catch (error) {
        console.error("Error parsing 'result' property:", error);
    }
}

// Function to create a bar graph based on the parts of speech
/**
 * Creates a bar graph using the provided data of part-of-speech counts.
 * @param {Object} posCounts - An object containing the counts of each part-of-speech.
 * @returns None
 */
function createBarGraph(posCounts) {
    // Get the canvas element
    var canvas = document.getElementById('posChart');

    // Extract labels and data for the chart
    var labels = Object.keys(posCounts);
    var data = Object.values(posCounts);

    // Define colors for each part of speech
    var colors = {
        'NN': '#3366cc',   // Noun
        'VBN': '#dc3912',  // Verb, past participle
        'DT': '#ff9900',   // Determiner
        'JJ': '#109618',   // Adjective
        'UH': '#990099',   // Interjection
        'VBD': '#0099c6',  // Verb, past tense
        'CC': '#dd4477',   // Coordinating conjunction
        'RB': '#66aa00',   // Adverb
        'IN': '#b82e2e',   // Preposition or subordinating conjunction
        'WRB': '#316395',  // Wh-adverb
        'VB': '#994499',   // Verb, base form
        'NNS': '#22aa99',  // Noun, plural
        'PRP': '#aaaa11',  // Personal pronoun
        'PRP$': '#6633cc', // Possessive pronoun
        'VBP': '#329262'   // Verb, non-3rd person singular present
    };

    // Map the colors to the corresponding labels
    var backgroundColors = labels.map(function (label) {
        return colors[label] || '#777777'; // Default color if not specified
    });

    // Creates a bar chart
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Parts of Speech',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#000', // Border color
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
