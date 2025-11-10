# gemini-ai-genie-guesser


## 🚀 Run with Docker

**Prerequisites:**

* [Docker](https://docs.docker.com/get-docker/) must be installed on your system.

---

### 1. Build the Docker Image

Run the following command to build the image. Replace `your_api_key` with your actual **Gemini API key**.

```bash
docker build --build-arg GEMINI_API_KEY=your_api_key -t ai-genie-guesser .
```

---

### 2. Run the Docker Container

Start the container and map port **8080** on your local machine to port **80** inside the container.

```bash
docker run -p 8080:80 ai-genie-guesser
```

---

### 3. Access the Application

Open your browser and visit:
👉 **[http://localhost:8080](http://localhost:8080)**

Your AI Genie Guesser should now be up and running! 🎉

---
