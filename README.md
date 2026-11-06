# Folio AI / AGENTFOLIO — Beta Version (v1.0)
> Autonomous Developer & Creator Portfolio Platform

![Folio AI Platform](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

Folio AI is a next-generation developer and creator portfolio engine that auto-ingests GitHub repositories, YouTube 4K video reels, and LinkedIn credentials into a high-converting, beautifully crafted portfolio in under 60 seconds — deployed live with 1-click with custom domain mapping and automated SSL.

Designed with the **Folio AI** clean design language: warm off-white canvas (`#F4F6F1`), deep pine primary (`#0F3D2E`), lime green accent (`#C6F432`), and modern typography powered by **Bricolage Grotesque** and **Inter**.

---

## ⚡ Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### 2. Installation
```bash
# Clone or navigate to the directory
cd beta_version

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root of the project using `.env.example`:
```bash
cp .env.example .env
```
Fill in your API credentials:
* **GitHub OAuth**: Client ID & Secret from GitHub Developer settings.
* **Google OAuth**: Client ID & Secret from Google Cloud Console.
* **Google Gemini AI**: API Key from Google AI Studio.
* **Vercel API**: Token from Vercel Account settings.
* **Resend API**: Key from Resend.com.

### 4. Run Development Servers
Start both the Express backend and the Vite frontend:
```bash
# Terminal 1: Start Backend API (Port 5001)
node server/index.js

# Terminal 2: Start Frontend Application (Port 5000)
npm run dev
```
Open **`http://localhost:5000/`** in your browser.

### 5. Production Build
```bash
npm run build
```
The compiled, static bundle will be generated in `dist/`.

---

## 🛡️ Security & Defensive Safeguards

AGENTFOLIO Beta is hardened for public social media distribution:

1. **API Rate Limiting (`express-rate-limit`)**:
   - Global: 200 requests / 15 mins per IP.
   - AI Endpoints: 25 requests / 5 mins (prevents Gemini quota exhaustion).
   - Contact Dispatch: 6 requests / 10 mins (anti-spam protection).
   - Vercel Deploy: 6 deployments / 15 mins.
2. **Security Headers**:
   - `X-Content-Type-Options: nosniff` (prevents MIME sniffing).
   - `X-XSS-Protection: 1; mode=block`.
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking while allowing in-studio iframe previews).
3. **SSRF Guard**:
   - All backend HTTP requests are bounded to verified external endpoints (`api.github.com`, `oauth2.googleapis.com`, `generativelanguage.googleapis.com`, `api.vercel.com`, `api.resend.com`, `youtube.com/oembed`).
4. **Credential Isolation**:
   - Zero API keys are exposed to the client bundle (`src/`). All keys reside strictly on the server in `.env`.
5. **Memory Exhaustion Protection**:
   - Express JSON parser strictly capped at `1mb` to prevent large payload memory attacks.

---

## 🚀 1-Click Deployment (Vercel & Cloud)

### Deploying the Frontend to Vercel:
1. Push this repository to GitHub.
2. Import the project into your Vercel Dashboard.
3. Set the build command to `npm run build` and output directory to `dist`.
4. Add your environment variables in Vercel Project Settings.

---

## 📄 License
MIT License. Built for developers and creators.
