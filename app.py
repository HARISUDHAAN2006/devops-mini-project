
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return """
    <h1>DevOps Health Monitor - Version 2</h1>
    <h2>Welcome to our DevOps Project!</h2>
    <p>This application demonstrates CI/CD automation.</p>
    <p>Built using Python, Flask, Docker and GitHub Actions.</p>
    <a href="/health">Check Application Health</a>
    """

@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "application": "DevOps Health Monitor"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
