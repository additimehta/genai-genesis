from flask import Flask
import sys
sys.path.append(str(Path(__file__).parent.parent))



#from deep_research_flask import deep_research_bp
#from final_generation_flask import final_generation_bp
#from gemini_and_cohere_flask import gemini_bp
from segment_flask import segment_bp
#from upload_flask import upload_bp


app = Flask(__name__)
CORS(app)



# API Registration

#app.register_blueprint(deep_research_bp, url_prefix="/api")
#app.register_blueprint(final_generation_bp, url_prefix="/api")
#  app.register_blueprint(gemini_bp, url_prefix="/api")
app.register_blueprint(segment_bp, url_prefix="/segment")
#app.register_blueprint(upload_bp, url_prefix="/api")




if __name__ == "__main__":
    os.makedirs("database", exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5001)