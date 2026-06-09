# ⚡ ScanForge

<div align="center">

### Forge beautiful QR codes for everything you share.

A modern QR code studio that lets users generate, customize, save, and manage professional QR codes for URLs, Wi-Fi networks, files, emails, SMS messages, and more.

</div>

---

## 📖 Overview

ScanForge is a full-stack QR code generation platform designed for creators, businesses, students, and professionals who need more than a basic QR generator.

Users can create visually customized QR codes, upload files for sharing, generate Wi-Fi access QR codes, store generated codes in their personal library, and re-download them whenever needed.

Whether you're sharing a portfolio, restaurant menu, event details, business contact information, or downloadable resources, ScanForge provides a fast and elegant solution.

---

## ✨ Features

### 🔗 URL QR Codes

Generate QR codes for:

* Websites
* Landing pages
* Portfolios
* Product pages
* Marketing campaigns

---

### 📶 Wi-Fi QR Codes

Allow users to connect instantly without typing passwords.

Supports:

* WPA
* WEP
* Open Networks

---

### 📧 Email QR Codes

Create QR codes that automatically open email clients with:

* Recipient address
* Subject line
* Message body

---

### 💬 SMS QR Codes

Generate QR codes that launch pre-filled SMS messages.

Perfect for:

* Customer support
* Event registration
* Business communication

---

### 📄 File Sharing QR Codes

Upload and generate QR codes for:

* PDFs
* Documents
* Images
* Audio Files

Files are securely stored and accessible through generated QR codes.

---

### 🎨 Advanced QR Customization

Personalize every QR code with:

* Multiple visual themes
* Custom foreground colors
* Background colors
* Pattern styles
* Size presets

Available pattern styles include:

* Square
* Rounded
* Diamond
* Dots
* Classy

---

### ☁️ Cloud Storage

Uploaded files are stored securely using Supabase Storage.

Benefits include:

* Persistent file hosting
* Fast retrieval
* Public sharing support

---

### 📚 QR History

Every generated QR code can be saved to the user's account.

Users can:

* Revisit previous QR codes
* Re-download designs
* Manage QR collections
* Access history across devices

---

### 🔐 Authentication

Secure user authentication powered by Supabase.

Includes:

* Registration
* Login
* Session management
* Protected user data

---

## 🏗️ System Architecture

```text
                    User
                      │
                      ▼

             Authentication
                (Supabase)

                      │
                      ▼

                 ScanForge

      ┌─────────────┼─────────────┐
      ▼             ▼             ▼

 QR Generator   File Uploads   QR History

      │             │             │
      └─────────────┼─────────────┘
                    ▼

            Supabase Storage
                    │
                    ▼

             QR Generation
             & Rendering

                    │
                    ▼

           Download & Sharing
```

---

## 🛠️ Tech Stack

### Frontend

* React 19
* TypeScript
* TanStack Start
* TanStack Router
* TanStack Query
* Tailwind CSS 4
* Radix UI
* Lucide React

### Backend

* Supabase
* PostgreSQL Database
* Authentication Services
* Storage Services

### QR Generation

* QR Code Styling

### Deployment

* Vercel

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/thanishkaykb/ScanForge.git

cd ScanForge
```

### Install Dependencies

```bash
npm install
```

or

```bash
bun install
```

### Configure Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

---

## 📂 Project Structure

```text
src/
│
├── routes/
│   ├── Landing Page
│   ├── Authentication
│   └── QR Studio
│
├── components/
│   ├── QRPreview
│   ├── PatternThumb
│   ├── QRTypeIcon
│   └── UI Components
│
├── integrations/
│   └── Supabase
│
├── lib/
│   ├── QR Logic
│   ├── API Utilities
│   └── Helpers
│
└── assets/
```

---

## 🎯 Use Cases

### Businesses

Create QR codes for:

* Menus
* Marketing campaigns
* Product information
* Customer feedback

### Students

Share:

* Portfolios
* Resumes
* Project reports
* Research documents

### Event Organizers

Provide:

* Registration links
* Event information
* Digital tickets
* Contact details

### Content Creators

Share:

* Social profiles
* Media files
* Landing pages
* Downloadable resources

---

## 🌟 Core Philosophy

ScanForge was built around a simple idea:

> Creating professional QR codes should be fast, beautiful, and accessible to everyone.

Rather than generating plain black-and-white codes, ScanForge helps users create visually appealing QR experiences while keeping them organized in a personal cloud library.

---

## 🔮 Future Enhancements

* Dynamic QR codes
* QR analytics dashboard
* Password-protected QR sharing
* Custom logo embedding
* Team workspaces
* Bulk QR generation
* Scan tracking
* Branded QR templates

---

## 👨‍💻 Author

### Thanishka Yogesh

* GitHub: https://github.com/thanishkaykb
* LinkedIn: https://www.linkedin.com/in/thanishka-yogesh/
* Portfolio: https://portfolio-thanishka-yogesh.vercel.app/

---
