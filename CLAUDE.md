# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript bilingual learning resource website for English language learners and US citizenship test preparation. Hosted on GitHub Pages at textenergy.github.io.

**Purpose:** Tutoring materials for Spanish speakers learning English, with focus on USCIS citizenship exam preparation.

## Development

This is a static HTML project with no build process, testing framework, or package manager. Changes are deployed directly via GitHub Pages.

To preview locally, open any HTML file directly in a browser.

## Architecture

### Content Structure
```
USCIS2025/Biling-USCIS-QA/web/
├── Biling-USCIS-QA.css       # Shared stylesheet (grid layout, nav colors)
├── Biling-USCIS-QA.js        # Shared JS (Spanish toggle, localStorage)
├── Biling-USCIS-QA2025.html  # Main hub/index page
├── Q01-15/ through Q119-128/ # 10 question set directories
│   ├── Biling-USCIS-QAxx-yy.html
│   └── audio/                # MP3 files (EN/ES pairs)
└── vocab/                    # Vocabulary quiz pages
```

### HTML Pattern
Each quiz file follows a consistent bilingual structure:
- Two-column CSS Grid layout (English left, Spanish right)
- Each question has English audio + Spanish audio (unofficial translation)
- Toggle buttons for Spanish visibility (per-question and global)
- Spanish visibility preference persists via localStorage

### Navigation Color Coding
- Red: Government/Civics
- Aqua: History
- Gold: Symbols/Holidays
- Blueviolet: Vocabulary

### Audio Files
274 MP3 files organized as `audio/EN_2025Qxxx.mp3` and `audio/ES_2025Qxxx.mp3` pairs within each question range directory.

## Key Patterns

- Bilingual consistency: English content first, then Spanish translation
- Grid layout: `display: grid; grid-template-columns: 1fr 1fr;` for side-by-side comparison
- Minimal JavaScript: only for toggle functionality and localStorage
- No external dependencies or frameworks
