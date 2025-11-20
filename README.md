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
- **Verification dates**: All information verified as of November 14, 2025

### Professional PDF Export
- **Page 1: Comparison Report**: Full comparison table with color-coded badges
- **Page 2: Your Requirements**: Summary of quiz questions and selected answers
- **Print-ready**: Professional formatting for stakeholder presentations

### Modern UI/UX
- **Responsive design**: Works seamlessly on desktop, tablet, and mobile
- **Dark mode support**: Comfortable viewing in any environment
- **Smooth animations**: Polished transitions and interactions
- **Accessibility**: WCAG-compliant interface

## 🔬 Research Methodology

### Decision Tree & Scoring Logic

The matching algorithm uses a weighted scoring system:

1. **Question-based scoring**: Each quiz question maps to specific LLM capabilities
2. **Binary scoring**: LLMs receive 10 points if they support a feature, 0 if they don't
3. **"Not Important" handling**: When marked "Not Important," all LLMs receive full points for that category
4. **Match percentage calculation**: 
   ```
   Match % = (Total Score / Maximum Possible Score) × 100
   ```

### Data Collection & Verification

All LLM data is sourced from official documentation:
- **Primary sources**: Privacy policies, Terms of Service, API documentation
- **Verification**: Cross-referenced with provider security pages and compliance certifications
- **Last verified**: November 14, 2025
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

- Node.js 18+ and npm
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
- **OpenAI API** (GPT-4, GPT-3.5)
- **Google Gemini API** (Gemini Pro, Gemini Ultra)
- **Anthropic Claude API** (Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku)

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
