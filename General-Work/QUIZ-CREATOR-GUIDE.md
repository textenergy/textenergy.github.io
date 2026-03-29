# ESL Quiz Creator Guide

## Overview

Each quiz is an interactive HTML page that presents bilingual English–Spanish multiple-choice questions. Quizzes can optionally be grouped into **scenarios** — short-context situations that give learners a narrative frame before each set of questions.

The workflow has three layers:

1. **Author** — write or edit quiz content in a spreadsheet (`.xlsx`)
2. **Generate** — run `build_quiz_files.py` to produce the quiz HTML and update the library
3. **Publish** — place the HTML in the correct topic folder; the page works in any browser with no server required

Answer option order is **fixed at generation time** — the script shuffles correct and distractor options once when the HTML is built, so the quiz is static and consistent for all learners. To re-randomize, regenerate the HTML.

---

## File Structure

```
General-Work/                       ← repository root
│
├── quiz.css                        ← shared styles (all quizzes use this)
├── quiz.js                         ← shared quiz engine (all quizzes use this)
├── quiz-template.xlsx              ← blank template for new quizzes
├── quiz-library.csv                ← master record of all questions across all quizzes
├── build_quiz_files.py             ← generation script (Python 3, requires openpyxl)
│
├── QUIZ-CREATOR-GUIDE.md           ← this file
│
├── Dairy/
│   ├── dairy_quiz.html             ← generated quiz page (do not edit by hand)
│   └── dairy_quiz.xlsx             ← source data for the dairy quiz
│
├── Landscaping/
│   ├── tools_quiz.html             ← generated quiz page (do not edit by hand)
│   └── tools_quiz.xlsx             ← source data for the landscaping tools quiz
│
└── Conversation/                   ← example new topic folder (create as needed)
    ├── conversation_quiz.html
    └── conversation_quiz.xlsx
```

**Rule:** Each topic gets its own subfolder. The HTML references `../quiz.css` and `../quiz.js` one level up. Never edit the HTML files directly — edit the `.xlsx` and regenerate.

---

## The Spreadsheet Format

Open `quiz-template.xlsx` or any existing topic `.xlsx` to see the column layout. Row 1 is the header; row 2 is a notes row (yellow, italic) explaining each column. Data starts at row 3.

| Column | Required | Description |
|--------|----------|-------------|
| `quiz_id` | Yes | Unique quiz identifier, e.g. `DAIRY-001`. See [ID Scheme](#id-scheme). |
| `quiz_title` | Yes | Display title shown in the page heading, e.g. `Dairy Farm Vocabulary Quiz`. |
| `scenario_id (optional)` | No | Scenario identifier, e.g. `DAIRY-001-S01`. Leave blank for flat quizzes with no scenarios. |
| `scenario_title (optional)` | No | Short label shown on the scenario selector button, e.g. `Clean the Barn`. |
| `scenario_narrative_en (optional)` | No | English context paragraph shown above the questions. |
| `scenario_narrative_es (optional)` | No | Spanish translation of the narrative (displayed in italics below the English). |
| `question_id` | Yes | Unique question identifier, e.g. `DAIRY-001-Q01`. |
| `sentence_en` | Yes | Full English sentence. Wrap the target keyword in square brackets: `Use the [shovel] to dig the hole.` |
| `keyword` | No | Plain-text English keyword shown in answer feedback. Use for scenario-based quizzes (Format A). Leave blank for flat quizzes where the whole sentence is the question (Format B). |
| `correct` | Yes | The correct answer text. |
| `option_b` | Yes | First distractor (wrong answer). |
| `option_c` | Yes | Second distractor. |
| `option_d` | No | Third distractor. Leave blank for 3-option questions. |
| `tts_lang` | Yes | Language code for text-to-speech, e.g. `en-US`. Default is `en-US`. |
| `notes` | No | Free-text author notes. **Not exported** to HTML or the library CSV. |

### Two Quiz Formats

**Format A — scenario-based** (e.g. `dairy_quiz`):
- Questions are grouped under scenarios
- `scenario_id`, `scenario_title`, and narratives are filled in
- `keyword` is filled in — it is the single word or phrase being tested within the sentence
- The sentence repeats with a different `[bracketed]` keyword for each question in the group

**Format B — flat question list** (e.g. `tools_quiz`):
- No scenarios; `scenario_*` columns are left blank
- `keyword` is left blank
- Each question is an independent sentence with one `[bracketed]` term
- Typically has 4 answer options (correct + 3 distractors)

---

## ID Scheme

IDs are assigned once at creation and never changed. They are the stable key linking the `.xlsx` source, the HTML data, and the `quiz-library.csv` rows.

### Quiz IDs

Use a short uppercase topic code plus a zero-padded number:

| Topic folder | Quiz ID pattern | Example |
|---|---|---|
| `Dairy` | `DAIRY-NNN` | `DAIRY-001` |
| `Landscaping` | `TOOLS-NNN` | `TOOLS-001` |
| `Conversation` | `CONV-NNN` | `CONV-001` |

If a topic grows to more than one quiz, increment the number: `DAIRY-002`, `DAIRY-003`, etc.

### Scenario IDs

`{QUIZ-ID}-S{NN}` — e.g. `DAIRY-001-S01`, `DAIRY-001-S02`

Scenarios are numbered sequentially within a quiz. Do not reuse or renumber existing IDs.

### Question IDs

`{QUIZ-ID}-Q{NN}` — e.g. `DAIRY-001-Q01`, `DAIRY-001-Q87`

Questions are numbered sequentially across the entire quiz (not per scenario). When adding questions to an existing quiz, continue from the last existing number.

### Getting New IDs

Ask the quiz generator (Claude, or another contributor with access to `build_quiz_files.py`) to assign the next available IDs for your topic. Check `quiz-library.csv` to see the highest existing question number for any quiz.

---

## Step-by-Step: Edit an Existing Quiz

Use this process to fix a typo, change an answer option, or add questions to a quiz that already exists.

**1. Open the source spreadsheet**

Open the `.xlsx` file for the quiz you want to edit (e.g. `Dairy/dairy_quiz.xlsx`). Do not edit the HTML file directly.

**2. Make your changes**

- To fix a typo: find the row by `question_id` and correct the cell.
- To change a distractor: edit the `option_b`, `option_c`, or `option_d` cell.
- To change the correct answer: edit the `correct` cell. Do not change the `question_id`.
- To add questions: append new rows after the last existing row. Assign the next available `question_id` values (check the last ID in the file and increment).
- To remove a question: delete the row. Do not renumber the remaining IDs.

**3. Save the spreadsheet**

Save as `.xlsx` in the same location.

**4. Run the build script**

```
python build_quiz_files.py
```

The script regenerates the HTML and rewrites `quiz-library.csv`. See [Running the Build Script](#running-the-build-script) for setup instructions.

**5. Verify the HTML**

Open the regenerated HTML file in a browser and check:
- The changed or new questions appear correctly
- The answer options are in a reasonable order (not all correct answers in the same position)
- Text-to-speech plays the sentence correctly when 🔊 is clicked

**6. Commit both files**

Commit the updated `.xlsx` and the regenerated `.html` together. Also commit the updated `quiz-library.csv`.

---

## Step-by-Step: Create a New Quiz

**1. Decide the quiz format**

- Does the quiz have scenarios (context paragraphs with groups of questions)? → **Format A**
- Is it a flat list of independent questions? → **Format B**

**2. Create a topic folder**

Create a new subfolder under `General-Work/` named for the topic, e.g. `Conversation/`.

**3. Copy the template**

Copy `quiz-template.xlsx` into the new folder and rename it, e.g. `conversation_quiz.xlsx`. Delete the example data row (row 3) before adding your content.

**4. Assign IDs**

Choose a topic prefix not already in use and start numbering from `001`. Check `quiz-library.csv` to confirm the prefix is new. Example for a new Conversation quiz:
- Quiz ID: `CONV-001`
- Scenario IDs: `CONV-001-S01`, `CONV-001-S02`, … (if using scenarios)
- Question IDs: `CONV-001-Q01`, `CONV-001-Q02`, …

**5. Fill in the spreadsheet**

Fill in one row per question. Tips:
- For **Format A**: fill in `scenario_id` and `scenario_title` for every question in that scenario, then change them for the next scenario. The same scenario values repeat across all questions in the group.
- Write the `sentence_en` with the target keyword in `[square brackets]`.
- The `correct` column always holds the correct answer regardless of which letter it will display as — the build script handles placement.
- Use the `notes` column freely for reminders, source references, or questions for reviewers. Notes are not exported.
- `option_d` can be left blank if you want only 3 options for a question.
- `tts_lang` defaults to `en-US`. If you ever want a Spanish sentence read aloud instead, enter `es-US`.

**6. Register the new quiz in `build_quiz_files.py`**

Open `build_quiz_files.py` and add your quiz data following the same pattern as `DAIRY_SCENARIOS` (Format A) or `TOOLS_QUESTIONS` (Format B). Also add calls to `build_xlsx()`, `build_csv()`, and the HTML generation function in `__main__`.

> **Note:** If you are not comfortable editing Python, share the completed `.xlsx` with someone who maintains the script, or ask Claude to add it.

**7. Run the build script**

```
python build_quiz_files.py
```

This creates:
- `Conversation/conversation_quiz.html` — the quiz page
- Updated `quiz-library.csv` — with the new quiz's questions appended

**8. Verify in the browser**

Open the HTML file locally. Check:
- The page title and header text are correct
- Scenario selector buttons appear (Format A) or are absent (Format B)
- All questions load and navigate correctly
- Correct answers are marked correctly after selection
- 🔊 button plays the English sentence

**9. Commit**

Commit the new `.xlsx`, the new `.html`, and the updated `quiz-library.csv`.

---

## Running the Build Script

### Requirements

- Python 3.8 or later
- The `openpyxl` library

Install `openpyxl` if not already present:

```
pip install openpyxl
```

### Running

From the `General-Work/` folder:

```
python build_quiz_files.py
```

The script rebuilds all registered quizzes and the library CSV in one pass. Output confirms each file written and the total question count.

### What the script does

1. Reads all quiz data defined in the Python source
2. Shuffles answer options once per question (using a fixed random seed for reproducibility)
3. Writes each quiz's `.xlsx` source file
4. Regenerates each quiz's `.html` file with options baked into the data
5. Rewrites `quiz-library.csv` with all questions from all quizzes

---

## The Quiz Library CSV

`quiz-library.csv` is the master record of all quiz content. It is regenerated in full each time the build script runs.

**Columns:**

| Column | Description |
|---|---|
| `quiz_id` | Quiz identifier |
| `quiz_title` | Full quiz title |
| `topic_folder` | Subfolder name (e.g. `Dairy`) |
| `scenario_id` | Scenario identifier, or blank |
| `scenario_title` | Scenario title, or blank |
| `question_id` | Unique question identifier |
| `sentence_en` | English sentence with `[bracketed]` keyword |
| `keyword` | Keyword shown in feedback, or blank |
| `correct` | Correct answer text |
| `option_b` | First distractor |
| `option_c` | Second distractor |
| `option_d` | Third distractor, or blank |
| `tts_lang` | TTS language code |

**Note:** The library stores the *canonical* answers from the source data — not the shuffled display order used in the HTML. Use it to search for vocabulary overlap across quizzes, identify gaps, or plan new content.

### Useful things to do with the CSV

- Open in Excel and filter by `topic_folder` to review all content for a topic
- Sort by `correct` to find duplicate translations across quizzes
- Filter by `keyword` to see how many questions test a particular word
- Count rows per `quiz_id` to compare quiz length across topics

---

## Quick Reference

### Sentence authoring syntax

Wrap the target keyword in square brackets in the `sentence_en` column. The build script converts these to underlined text in the HTML.

```
Use the [shovel] to dig the hole.   →   Use the <u>shovel</u> to dig the hole.
```

Only one bracketed term per question is supported. If a sentence tests two terms (e.g. `Bring the [loppers] and the [electric shears]`), that is treated as a single compound keyword.

### 3-option vs 4-option questions

- Leave `option_d` blank → question displays 3 choices (A, B, C)
- Fill in `option_d` → question displays 4 choices (A, B, C, D)

### Changing option order after generation

The build script uses a fixed random seed (`random.seed(42)`), so option order is the same every time you regenerate from the same source data. To get a different shuffle, change the seed value in `build_quiz_files.py` and regenerate.

### Adding a new topic prefix

Any short uppercase string not already in `quiz-library.csv` is valid. Keep it 3–6 characters: `CONV`, `FOOD`, `SAFETY`, `HEALTH`, etc.
