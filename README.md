# LLM Privacy & Security Selection Guide

An interactive web application that helps organizations select the right Large Language Model (LLM) API based on their privacy, security, and compliance requirements.

**Developed by CMU Privacy Engineering**

## 🎯 Overview

This tool provides a guided quiz to assess your organization's privacy and security needs, then matches you with LLM providers (OpenAI, Google Gemini, Anthropic Claude, and others) that best fit your requirements. The matching algorithm considers training policies, data sensitivity support, security features, compliance certifications, user rights, transparency, data residency, incident response, and data portability.

## ✨ Features

### Interactive Quiz
- **9 comprehensive questions** covering all aspects of LLM privacy and security
- **Smart question types**: Single-select and multi-select options
- **"Not Important" options**: Skip requirements that don't apply to your use case
- **Progress tracking**: Visual progress indicator and question navigation
- **Resume capability**: Navigate between questions freely
- **Reset functionality**: Start over at any time

### Intelligent Matching System
- **Scoring algorithm**: Each LLM is scored based on your specific requirements
- **Match percentage**: Clear visualization of how well each provider aligns with your needs
- **Multiple provider comparison**: Compare up to 4 LLMs side-by-side
- **Dynamic updates**: Adjust requirements and see results update in real-time

### Rich Comparison Table
- **Color-coded badges**: Visual indicators for supported features
- **Categorized features**: Training policy, data support, security, compliance, user rights, transparency, data location, incident response, and data portability
- **Policy references**: Direct links to official privacy policies and terms of service
- **Verification dates**: Per-source dates; new residency and breach-notification evidence checked October 7, 2026

### Professional PDF Export
- **Comparison Report**: Full comparison table with color-coded badges
- **Following pages: Your Requirements**: Summary of quiz questions and selected answers
- **Print-ready**: Professional formatting for stakeholder presentations

### Modern UI/UX
- **Responsive design**: Works seamlessly on desktop, tablet, and mobile
- **Dark mode support**: Comfortable viewing in any environment
- **Smooth animations**: Polished transitions and interactions
- **Accessibility**: WCAG-compliant interface

## 🔬 Research Methodology

### Decision Tree & Scoring Logic

The matching algorithm uses a weighted scoring system implemented in `src/utils/scoring.ts`:

#### How Match Percentage is Calculated

For each LLM provider, the algorithm:

1. **Initializes counters**:
   - `totalScore = 0` (actual points earned by the LLM)
   - `maxPossibleScore = 0` (maximum points achievable based on user's selections)

2. **Processes each user answer**:

   **For multi-select questions** (when user selects multiple options):
   - If "Not Important" is selected → LLM receives full 10 points, max increases by 10
   - Otherwise, for each selected option:
     - Adds the LLM's predefined score for that option (from `llm.scores[optionId]`)
     - Adds 10 to maxPossibleScore (one per selected option)

   **For single-select questions**:
   - If "Not Important" is selected → LLM receives full 10 points, max increases by 10
   - Otherwise:
     - Adds the LLM's predefined score for that option
     - Adds 10 to maxPossibleScore

3. **Calculates final match percentage**:
   ```
   Match % = (totalScore / maxPossibleScore) × 100
   ```

4. **Sorts results**: LLMs are ranked by match percentage (highest first)

#### Scoring Example

If a user answers 5 single-select questions:
- **maxPossibleScore** = 50 (5 questions × 10 points each)
- **totalScore** = sum of the LLM's scores for all selected options
- Example: If an LLM scores [10, 8, 10, 7, 5] for the selected options:
  - totalScore = 40
  - **matchPercentage = (40/50) × 100 = 80%**

#### Key Insights

- Each LLM has a **score (0-10) or an explicit `null`** for every requirement. `null` means unverified, earns no match points, and is shown separately from confirmed lack of support.
- **Global / Any** earns full points for all providers because it imposes no location restriction.
- The Gemini entry covers the **Developer API**; Vertex AI has separate terms and residency controls.
- A score of **10 means full support**, **0 means no support**
- Partial scores (1-9) represent varying levels of support
- The match percentage shows **how well an LLM aligns with your specific requirements**
- "Not Important" selections ensure those criteria don't penalize any LLM

### Data Collection & Verification

All LLM data is sourced from official documentation:
- **Primary sources**: Privacy policies, Terms of Service, API documentation
- **Verification**: Cross-referenced with provider security pages and compliance certifications
- **Verification dates**: Legacy entries are dated November 14, 2025; selected residency and breach-notification entries were checked October 7, 2026. This is not a complete refresh of all provider policies.
- **Update cycle**: Quarterly reviews to ensure accuracy

### Feature Categories

**Training Policy**
- No training on user data
- Opt-out available
- Anonymized training
- Training allowed

**Data Sensitivity Support**
- PII (Personally Identifiable Information)
- Sensitive/Regulated data
- Minors' data
- General/Public data

**Security Features**
- End-to-end encryption
- SSO (Single Sign-On)
- MFA (Multi-Factor Authentication)
- Audit logs
- DLP (Data Loss Prevention)

**Compliance & Certifications**
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- HIPAA (Health Insurance Portability and Accountability Act)
- SOC 2 Type 2

**User Rights**
- Data deletion
- Data access
- Data retention control

**Transparency**
- Subprocessor disclosure
- No sharing for analytics
- Policy change notifications

**Data Residency**
- US-only storage
- EU-only storage
- Specific regional options
- Global availability

**Incident Response**
- Breach notification
- Incident reports
- SLA guarantees

**Data Portability**
- Self-service export
- API-based export
- Export on request

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/LuD1161/llm-practicioner-guide.git
cd llm-practicioner-guide

# Install dependencies
npm install
```

### Running the Application

```bash
# Development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Other Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Regression tests
npm test
```

## 📁 Project Structure

```
llm-practicioner-guide/
├── src/
│   ├── components/          # React components
│   │   ├── ComparisonTable.tsx    # Results comparison table
│   │   ├── QuizQuestion.tsx       # Individual quiz question
│   │   ├── QuizSidebar.tsx        # Quiz navigation sidebar
│   │   ├── QuestionConfigurator.tsx  # Results configuration panel
│   │   └── PolicyModal.tsx        # Policy reference modal
│   ├── data/
│   │   └── quiz-data.json         # Quiz questions and LLM data
│   ├── types/
│   │   └── quiz.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── scoring.ts             # Scoring algorithm
│   ├── App.tsx                    # Main application
│   └── main.tsx                   # Application entry point
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

## 🛠 Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: jsPDF with jspdf-autotable
- **State Management**: React Hooks

## 📊 Supported LLM Providers

Currently includes:
- **OpenAI API**
- **Google Gemini API**
- **Anthropic Claude API**
- **DeepSeek**
- **Moonshot**
- **Qwen**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Adding New LLM Providers

1. Research the provider's privacy and security features
2. Update `src/data/quiz-data.json` with LLM details
3. Add policy references with verification dates
4. Update feature scores based on capabilities
5. Test the matching algorithm
6. Submit PR with documentation

### Updating Existing Data

- Verify information against official sources
- Update `lastVerified` dates
- Document changes in commit message

## 📄 License

This project is developed by CMU Privacy Engineering for educational and research purposes.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 🙏 Acknowledgments

- CMU Privacy Engineering team
- LLM providers for transparent documentation
- Open source community for tools and libraries
