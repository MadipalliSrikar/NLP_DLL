from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import logging
from stanfordcorenlp import StanfordCoreNLP

app = Flask(__name__)
CORS(app)
app.logger.setLevel(logging.DEBUG)

# Set up Stanford CoreNLP
nlp = StanfordCoreNLP('http://CoreNLP', port=9000)

"""
Define a route for the root URL ("/") of the application. When this route is accessed, 
print a message indicating that the index route has been accessed. 
Then, render the "index.html" template and pass a variable named "result" with a value of None to the template.
"""

@app.route('/')
def index():
    print("Index route accessed.")
    return render_template('index.html', result=None)

# app route for processing text
    """
    This is a Flask route that processes text input sent via a POST request.
    It expects the text to be sent as a form field named 'text'.
    """
@app.route('/process', methods=['POST'])
def process_text():
    user_input = request.form['text']

    if not user_input or '.' not in user_input:
        return jsonify({'error': 'Please enter at least one sentence.'})
    
    app.logger.info(f"Processing text: {user_input}")

    # Process text using Stanford CoreNLP
    result = nlp.annotate(user_input, properties={
        'annotators': 'tokenize,ssplit,pos',
        'outputFormat': 'json'
    })

    app.logger.info(f"Result: {result}")
    
    # Return result as JSON
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
