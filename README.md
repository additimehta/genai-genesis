# genai-genesis
# AccessPath 🌟

AccessPath is an AI-powered accessibility upgrade visualization system that transforms how we approach accessibility improvements in public spaces. Using advanced computer vision and AI, it generates comprehensive, realistic visualizations of accessibility upgrades while providing detailed implementation guidance.

## Features 🚀

•⁠  ⁠*Intelligent Space Analysis*: Analyzes photographs to identify accessibility improvement opportunities
•⁠  ⁠*Standards Compliance*: Generates recommendations adhering to AODA and other accessibility standards
•⁠  ⁠*Realistic Visualizations*: Creates hyperrealistic previews of proposed upgrades
•⁠  ⁠*Multiple Variations*: Offers different design options balancing aesthetics, functionality, and budget
•⁠  ⁠*Comprehensive Research*: Provides detailed cost estimates, material specifications, and contractor recommendations
•⁠  ⁠*Practical Implementation*: Delivers complete roadmaps for upgrade implementation

## How It Works 🛠️

1.⁠ ⁠*Image Preprocessing*
   - Enhances image quality
   - Prepares for feature detection

2.⁠ ⁠*Feature Detection & Spatial Analysis*
   - Identifies architectural features
   - Generates depth maps
   - Analyzes spatial relationships

3.⁠ ⁠*Accessibility Analysis*
   - Generates upgrade recommendations
   - Ensures compliance with standards

4.⁠ ⁠*Structured Data Processing*
   - Enhances upgrade descriptions
   - Ranks improvement options
   - Creates actionable plans

5.⁠ ⁠*Deep Research*
   - Researches costs
   - Analyzes materials and specifications
   - Compiles implementation details

6.⁠ ⁠*Final Visualization*
   - Creates realistic upgrade previews
   - Generates multiple design variations

Installation & Setup
Backend Setup
Clone the Repository:
git clone https://github.com/your-username/additimehta-genai-genesis.git
cd additimehta-genai-genesis
Create and Activate a Virtual Environment:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install Python Dependencies:

pip install -r requirements.txt
Configure Environment Variables:
Create a .env file in the root directory and add your API keys (e.g., COHERE_API_KEY, GENAI credentials).

# Frontend Setup
Navigate to the Frontend Directory:
cd frontend
Install Node Dependencies:
npm install
Start the Frontend Development Server:
npm run dev
Running the Application
Backend (API):
Launch the Flask application:
ppython segment_flask.py
python gemini_and_cohere_flask.py
python deep_research_flask.py
python final_generation_flask.py

The API will start and listen on the configured port (default is 5003).

Frontend (Web Interface):
With the development server running, access the application at http://localhost:3000 or the port specified in your configuration.
