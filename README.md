# RSA Cryptosystem — Interactive Virtual Laboratory

A complete, interactive educational virtual laboratory for the **Rivest–Shamir–Adleman (RSA)** public-key cryptosystem. Built for university Information Security coursework.

- **Frontend-only:** 100% browser-based using native JavaScript `BigInt` for arbitrary precision arithmetic.
- **Zero backend dependencies:** No server, database, Python, PHP, or external APIs required.
- **Step-by-step learning:** Guided simulation that teaches RSA from first principles with visual feedback.
- **Interactive parameter control:** Full control over primes $(p, q)$, modulus $n$, totients $\phi(n)$ & $\lambda(n)$, public exponent $e$, private key $d$, and plaintext $m$.

## ✨ What's New (v1.1)

The **Simulation** page has been completely redesigned for easier learning:

- **6-Step Guided Workflow**: Follow a clear path from choosing primes to encrypting messages
- **Progress Tracking**: Visual progress bar showing completion status
- **Educational Explanations**: Each step includes simple explanations and learning tips
- **Validation Feedback**: Real-time checks ensure you're using valid values
- **Auto-Generate Option**: Skip ahead with automatically generated valid keys
- **Cleaner Interface**: Focused design showing only relevant information per step

---

## 🚀 How to Run on a New System

### 1. Prerequisites
Ensure the target system has **Node.js** (version 18 or higher) installed:
- Download Node.js if needed: [https://nodejs.org/](https://nodejs.org/)
- Verify in your terminal/command prompt:
  ```bash
  node -v
  npm -v
  ```

---

### 2. Quick Start Steps

1. **Extract / Copy the project folder:**
   Place the `rsa-lab` folder on the new computer.

2. **Open Terminal / Command Prompt:**
   Navigate into the project directory:
   ```bash
   cd path/to/rsa-lab
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```
   *(This downloads React, Vite, and Lucide Icons in under 30 seconds)*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Open the local link shown in the terminal:
   👉 **http://localhost:5173/**

---

## 📦 What to Share (Folder Cleanliness Tip)

When zipping or emailing the project folder to a classmate, teammate, or professor:
- **INCLUDE:**
  - `src/` (all source code)
  - `index.html`
  - `package.json`
  - `vite.config.js`
  - `README.md`
- **DO NOT INCLUDE (DELETE FIRST TO KEEP ZIP SMALL):**
  - `node_modules/` (takes hundreds of MB; will be re-installed automatically with `npm install`)
  - `dist/` (build output, can be rebuilt anytime with `npm run build`)

---

## 🛠 Project Structure

```
rsa-lab/
├── index.html              # HTML shell with Plus Jakarta Sans & JetBrains Mono fonts
├── package.json            # Project dependencies (React, Vite, Lucide Icons)
├── vite.config.js          # Vite configuration with React plugin
├── src/
│   ├── main.jsx            # React root entry point
│   ├── App.jsx             # Main application layout, sidebar, and routing
│   ├── index.css           # Modern EdTech design system
│   ├── lib/
│   │   └── rsa.js          # Pure BigInt RSA math (Miller-Rabin, extGCD, modPow, CRT, Fermat)
│   └── pages/
│       ├── Simulation.jsx  # Core RSA Control Center with full parameter control
│       ├── Workbench.jsx   # Math Inspector (Square-and-Multiply, extGCD, CRT speedup)
│       ├── Attacks.jsx     # RSA Cryptanalysis (Fermat factorization, small e=3, common modulus)
│       ├── Playground.jsx  # Parameter experiments (avalanche diffusion, Euler's theorem)
│       ├── Quiz.jsx        # Self-evaluation MCQ test with score breakdown
│       ├── Theory.jsx      # Mathematical proofs, trapdoor functions, and references
│       └── Dashboard.jsx   # Overview hero banner and live instant console
└── README.md               # Setup and execution guide
```

---

## 🧪 Production Build (Optional)

To compile the application into static HTML/CSS/JS files:
```bash
npm run build
npm run preview
```
The optimized bundle will be created inside the `dist/` directory.
