
from flask import Flask, jsonify, render_template
from datetime import datetime, timezone
import time

app = Flask(__name__)

START_TIME = time.time()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/health")
def health():
    uptime = int(time.time() - START_TIME)

    return jsonify({
        "status": "healthy",
        "application": "DevOps Health Monitor",
        "uptime_seconds": uptime,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })


@app.route("/api/status")
def status():
    uptime = int(time.time() - START_TIME)

    return jsonify({
        "application": "DevOps Health Monitor",
        "status": "Operational",
        "uptime_seconds": uptime,
        "server_time": datetime.now(timezone.utc).isoformat()
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
