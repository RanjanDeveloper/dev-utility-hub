# 🛠️ Dev Utility Hub

**Dev Utility Hub** is a modern web application that provides essential developer utilities like **Subresource Integrity (SRI) hash generation**, built with **Next.js**, **Tailwind CSS**, and **ShadCN UI**.

It is designed to be fast, clean, secure, and easy to use — a single place for useful tools developers need in daily work.

---

## ✨ Features

- 🔐 **SRI Hash Generator**
  - Generate `sha256`, `sha384`, and `sha512` hashes
  - Automatically builds correct `<script>` and `<link>` tags
  - Supports JavaScript, CSS, WASM, and font files
- 🌗 **Dark / Light Mode**
- ⚡ **Fast & Secure**
- 🎯 **Modern UI using ShadCN**
- 🧩 **Extensible tool dashboard**

More tools will be added over time.

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** Tailwind CSS + ShadCN UI
- **Icons:** Lucide
- **Syntax Highlighting:** Shiki
- **Theme:** next-themes
- **Hashing:** Node.js Crypto API

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/dev-utility-hub.git
cd dev-utility-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔐 SRI Hash Generator

Enter a CDN URL such as:

```
https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js
```

The app will generate a secure SRI tag like:

```html
<script src="..." integrity="sha384-..." crossorigin="anonymous"></script>
```

You can copy and paste it directly into your HTML.



## 🌍 Why this exists

Most online SRI generators are:
- outdated
- ugly
- or unsafe

Dev Utility Hub provides a **modern, developer-first** experience for security and tooling.

---

## 🛣 Roadmap

- ✔ SRI Generator  
- ⏳ CSP Generator  
- ⏳ Hash tools  
- ⏳ URL utilities  
- ⏳ API testers  

---

## ⭐ Support

If you find this useful, please **star the repo** ⭐  
It helps the project grow.

---

## 📄 License

MIT License
