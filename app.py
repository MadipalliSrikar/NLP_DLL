from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import logging
from stanfordcorenlp import StanfordCoreNLP

app = Flask(__name__)
CORS(app)
app.logger.setLevel(logging.DEBUG)

# Set up Stanford CoreNLP
nlp = StanfordCoreNLP('http://localhost', port=9000)

@app.route('/')
def index():
    print("Index route accessed.")
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_text():
    user_input = request.form['text']

    if not user_input or '.' not in user_input:
        return jsonify({'error': 'Please enter at least one sentence.'})
    
    print(f"Processing text: {user_input}")
    app.logger.info(f"Processing text: {user_input}")

    # Process text using Stanford CoreNLP
    result = nlp.annotate(user_input, properties={
        'annotators': 'tokenize,ssplit,pos',
        'outputFormat': 'json'
    })

    app.logger.info(f"Result: {result}")
    return jsonify({'result': result})

# API Endpoint for processing text
@app.route('/api/process', methods=['POST'])
def api_process_text():
    data = request.get_json()

    if 'text' not in data or not data['text'] or '.' not in data['text']:
        return jsonify({'error': 'Invalid input data.'})

    # Process text using Stanford CoreNLP
    result = nlp.annotate(data['text'], properties={
        'annotators': 'tokenize,ssplit,pos',
        'outputFormat': 'json'
    })

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
