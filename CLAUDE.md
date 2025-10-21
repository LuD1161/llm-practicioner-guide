# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive React-based quiz application that helps users find the right Large Language Model (LLM) for their needs. Users answer questions about their requirements, and the app calculates compatibility scores to recommend the best LLM options.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
vite build

# Type checking (without emitting files)
npm run typecheck

# Linting
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Core Application Flow

1. **Welcome Screen** (`App.tsx:66-102`) - Landing page with "Get Started" button
2. **Quiz Flow** (`App.tsx:118-182`) - Multi-question interface with navigation
3. **Results Screen** (`App.tsx:104-116`) - Displays ranked LLM recommendations

### State Management

The app uses React's `useState` for local state management with `localStorage` persistence:
- `userAnswers`: Stored in localStorage as `'llm-quiz-answers'` (saved on every update via `useEffect`)
- State is restored from localStorage on mount to allow users to continue interrupted sessions
- `handleRestart()` clears both state and localStorage

### Scoring Algorithm (`src/utils/scoring.ts`)

The scoring system calculates LLM compatibility:
- Each LLM has a `scores` object mapping option IDs to numerical scores (0-10)
- For each user answer, the corresponding score is added to the LLM's total
- Final match percentage = `(totalScore / maxPossibleScore) * 100`
- Results are sorted by match percentage in descending order
- Handles both single-select and multi-select questions

### Data Structure

Quiz configuration lives in `src/data/quiz-data.json`:
- **Questions**: Array of question objects with options
  - `multipleSelect`: boolean flag for multi-select questions
  - `options`: Array with `id`, `label`, `icon`, and `description`
- **LLMs**: Array of LLM objects
  - Each has `scores` object mapping option IDs to compatibility scores (0-10)
  - Higher scores indicate better fit for that option

### Component Hierarchy

```
App.tsx
├── QuizSidebar (navigation + progress tracking)
├── QuizQuestion
│   └── OptionCard (individual selectable options)
└── Results (final recommendations)
```

### Keyboard Navigation

`QuizQuestion.tsx` implements full keyboard accessibility:
- Arrow keys (Up/Down/Left/Right) navigate between options
- Space or Enter selects/deselects options
- Focus management via `focusedIndex` state and `data-option-index` attributes

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons (excluded from optimizeDeps in vite.config.ts)
- **Supabase** client library (installed but not actively used in current implementation)

## Modifying Quiz Content

To add/modify questions or LLMs:
1. Edit `src/data/quiz-data.json`
2. Ensure all option IDs are unique across questions
3. Add corresponding scores to each LLM's `scores` object for new options
4. Icons must match Lucide React icon names (e.g., "MessageSquare", "Code")

## Type Safety

All quiz-related types are defined in `src/types/quiz.ts`:
- `Question`, `Option`, `LLM`, `QuizData`, `UserAnswers`
- Run `npm run typecheck` before committing to catch type errors
