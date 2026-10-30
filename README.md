# ETBridge ⚡

> An authentic, lightning-fast, zero-bloat client for engineering students on KTU ETLab.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **PWA** capabilities.

---

## 💡 Why I Built This

The official ETLab mobile app is notoriously slow, buggy, and frustrating to use. It takes over 10 seconds to spin up, relies on an unoptimized webview wrapper, crashes frequently on attendance queries, and buries essential numbers (like how many classes you can afford to bunk or whether your duty leave was credited) under multiple dropdowns.

It felt absurd that engineering students were forced to deal with an app where the developers couldn't even bother to do a week's worth of quality testing before shipping it.

So I built **ETBridge** — a clean, instant, client-side web application that talks directly to ETLab's official endpoints with sub-100ms response times, live attendance simulations, and zero tracking.

---

## 🚀 Key Features

* **⚡ Sub-100ms Cold Starts**: Timetable and attendance data are cached locally using `localStorage` and Workbox Service Worker caching. Opens instantaneously even on slow 2G campus networks.
* **🛡️ Smart Bunk Margin & 75% Target Tracker**: Automatically calculates how many hours you can afford to skip (or must attend) to stay above KTU's mandatory 75% cutoff for each subject.
* **📝 Self-Reported Duty Leave Simulation**:
  * Log duty leaves by toggling specific hours of the day (e.g. Hours 4, 5, 6 or 3, 5, 6).
  * Immediately view projected attendance and updated 75% requirements without contaminating official records.
  * Auto-reconciles and removes pending claims once faculty officially enters approval into ETLab.
* **📅 Standard Indian Date Formatting**: Clean `DD/MM/YYYY` and `DD MMM YYYY` formatting with Indian week conventions across all schedules, exams, notices, and duty logs.
* **⏰ Live Period Awareness**: Detects current and upcoming timetable periods based on local clock time, accounting for teacher substitutions.
* **💬 Discord-Style Academic Profile**: Clean profile popup displaying college code (e.g. CEV), course, semester, roll number, and admission ID with quick-copy actions.
* **🌓 Dual Theme**: Thoughtfully designed Dark and Light themes with WCAG AA compliant text contrast and clean pastel badge highlights.
* **🏛️ Multi-College Support**: Compatible with all institutions utilizing ETLab (CEV, GCEK, MACE, TKMCE, JEC, VJEC, and more).
* **📱 Native PWA Experience**: Installable on Android (Chrome) and iOS (Safari) with standalone framing, zero browser bars, and offline availability.

---

## 🔒 Security & Privacy (Zero-Knowledge Architecture)

* **Direct Client-to-API**: All network requests originate directly from your browser to ETLab's official REST API (`https://api.students.etlab.app`).
* **Zero Middleman Servers**: There is no custom backend, database, proxy, or server-side logging.
* **Local Storage Only**: Your session token and pending duty leaves are stored solely on your device's browser `localStorage`.
* **Open Source**: The code is fully transparent, auditable, and licensed under the MIT License.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 19 + TypeScript
* **Build System**: Vite 6 + `vite-plugin-pwa`
* **Styling**: Tailwind CSS with custom glassmorphism and light/dark theme adaptation
* **Icons**: Lucide React
* **Router**: React Router v7
* **Date & Format Engine**: Custom zero-dependency Indian date & percentage parsing utilities

---

## 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/nimd/etbridge.git
cd etbridge

# 2. Install dependencies
pnpm install

# 3. Start local development server
pnpm dev

# 4. Typecheck and build for production
pnpm run build

# 5. Preview the production build
pnpm run preview
```

---

## 🚢 Free 1-Click Deployment (Cloudflare Pages / Vercel)

Because ETBridge has no backend servers or database requirements, it can be deployed for free on static hosting platforms:

### Cloudflare Pages / Vercel
1. Fork or push this repository to GitHub.
2. In Cloudflare Pages or Vercel, select **Create a new project** and link this repository.
3. Build Settings:
   * **Framework Preset**: `Vite`
   * **Build Command**: `pnpm build`
   * **Build Output Directory**: `dist`
4. Deploy!

---

## 👨‍💻 About Me

Built with care (and frustration) by **Niranjan M D** (Student, College of Engineering Vadakara).

If you find this project useful or want to contribute improvements, feel free to open an issue or pull request!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

*Disclaimer: ETBridge is an independent, community-driven open source project. It is not affiliated with, endorsed by, or sponsored by Etuwa Concepts or KTU.*
