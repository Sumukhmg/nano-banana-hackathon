# 📖 AI Manga Maker  
_By Sumukh M G and Harsh Yadav_

<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

---

## ✨ About the Project
AI Manga Maker is a web app that generates manga-style comics from text prompts using **Gemini AI**.  
Users can create panels, compile them into pages, and export a manga book — all powered by generative AI.

---

## 🔗 Links
- 👨‍💻 [Sumukh M G (LinkedIn)](https://www.linkedin.com/in/sumukh-mg/)  
- 👨‍💻 [Harsh Yadav (LinkedIn)](https://www.linkedin.com/in/iharsh-mix/)  
- 🌐 [Live Project Link](https://nano-banana-hackathon-ryan.vercel.app/)  
- 🎥 [Demo Video](#)(https://youtu.be/LB7-zHGqUbs) 

---

## 🖼️ Demo Screenshots
| Input Prompt | Generated Manga Panel |
|--------------|-----------------------|
| `"Two rival student detectives solve a mystery at their high school festival."` | <img width="1180" height="861" alt="image" src="https://github.com/user-attachments/assets/ed125c64-b381-4fbe-858e-6e6a34ebea57" /> |

---

## ⚡ Features
- 🖊️ Generate manga-style panels from prompts  
- 📚 Auto-arrange panels into manga pages  
- 📕 Export a **Manga Book (PDF)**  
- 🎨 Supports multiple styles (classic manga, color manga, sketch)  

---

## 🛠️ How It Works
1. **User Input**: Enter a manga story idea or text prompt.  
2. **AI Generation**: Gemini AI (`gemini-2.5-flash-image-preview`) creates manga panels.  
3. **Panel → Page**: Panels are combined into manga-style pages.  
4. **Export**: Save as a PDF manga comic book.  

---

## 🚀 Run Locally

### Prerequisites
- Node.js
- Gemini API Key

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Add your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 3. Run the app
npm run dev
