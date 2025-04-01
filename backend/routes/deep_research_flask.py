from flask import Flask, request, jsonify
import json
import os

from ..deep_research_custom.deep_research import run_deep_research_from_file

deep_research_bp = Blueprint("deep_research", __name__)

DATABASE_FOLDER = "database"

@app.route('/deep_research', methods=['POST'])
def deep_research_api():
    req = request.get_json()

    if not req or "base_name" not in req:
        return jsonify({"error": "Missing 'base_name' in request body"}), 400

    base_name = os.path.splitext(req["base_name"])[0]
    input_file = os.path.join(DATABASE_FOLDER, f"{base_name}_upgrades.json")
    output_file = os.path.join(DATABASE_FOLDER, f"{base_name}_deep_research_report.json")

    if not os.path.exists(input_file):
        return jsonify({"error": f"Input file '{input_file}' not found"}), 404

    try: 
        run_deep_research_from_file(input_file=input_file, output_file=output_file)

        if not os.path.exists(output_file):
            return jsonify({"error": "Deep research report was not generated"}), 500


        with open(output_file, "r") as f:
            result = json.load(f)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route('/deep_research/<base_name>', methods=['GET'])
def deep_research_get(base_name):
    output_file = os.path.join(DATABASE_FOLDER, f"{base_name}_deep_research_report.json")


    if not os.path.exists(output_file):
        return jsonify({"error": f"Report for '{base_name}' not found"}), 404
    
    try:
        with open(output_file, "r") as f:
            result = json.load(f)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

