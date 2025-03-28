from flask import Flask
from flask_cors import CORS 
import os

from routes.deep_research import deep_research_bp


app = Flask(__name__)

app.register_blueprint(deep_research_bp)


if __name__ == "__main__":
    os.makedirs("database", exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5001)