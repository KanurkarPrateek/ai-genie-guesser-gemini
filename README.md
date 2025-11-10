<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hchMU8KBHJxVOL_dL64r1bYSJ8S4vRur

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run with Docker

**Prerequisites:**  Docker

1. Build the Docker image:
   ```bash
   docker build --build-arg GEMINI_API_KEY=your_api_key -t ai-genie-guesser .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 8080:80 ai-genie-guesser
   ```

3. Open your browser and navigate to:
   `http://localhost:8080`
# ai-genie-guesser-gemini
