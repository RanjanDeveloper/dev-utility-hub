# 🛠️ Dev Utility Hub

**Dev Utility Hub** is a modern web application that provides essential developer utilities like **Subresource Integrity (SRI) hash generation**, built with **Next.js**, **Tailwind CSS**, and **ShadCN UI**.

It is designed to be fast, clean, secure, and easy to use — a single place for useful tools developers need in daily work.

---

## ✨ Features

- 🔐 **SRI Hash Generator**
  - Generate `sha256`, `sha384`, and `sha512` hashes
  - Automatically builds correct `<script>` and `<link>` tags
  - Supports JavaScript, CSS, WASM, and font files

- 🧾 **JSON Formatter**
  - Format and minify JSON with syntax highlighting
  - Validate JSON with precise error locations
  - Generate TypeScript types from JSON
  - Optional output wrapping for long lines
- 🖼️ **Image ⇄ Data URI / Base64 Toolkit**
  - Convert images to data URIs or raw Base64
  - Decode Base64 back into images or UTF-8 text
  - Extract MIME, Base64 payload, and size estimates from data URIs
- 🔑 **JWT Decoder & Validator**
  - Decode header and payload with highlighting
  - Validate `exp`, `nbf`, and `iat` claims
  - Optional HMAC signature verification (HS256/384/512)
- 🌗 **Dark / Light Mode**
- ⚡ **Fast & Secure**
- 🎯 **Modern UI using ShadCN**
- 🧩 **Extensible tool dashboard**

More tools will be added over time.


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


## ⭐ Support

If you find this useful, please **star the repo** ⭐  
It helps the project grow.

---

## 📄 License

MIT License
