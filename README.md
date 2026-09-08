# BioDockLab

> **BioDockLab** is a bio-AI research software platform for managing experiment data, analyzing experimental outcomes, simulating biological responses, and generating research reports.

BioDockLab is designed as a lightweight research-assistant system that connects biological experiment records with AI-based analysis and digital twin-style simulation.

BioDockLab is not intended to replace biological researchers, clinicians, or medical professionals. Its purpose is to support experiment tracking, comparison, decision-making, simulation, and report generation through software.

---

## 1. Project Overview

BioDockLab focuses on the following research software workflow:

```text
Experiment Data
    ↓
AI Analysis
    ↓
Risk / Priority Evaluation
    ↓
Digital Twin Simulation
    ↓
Research Report
```

The core idea is to connect biological experiment data with computational analysis.

Instead of keeping experiment results only as notes or isolated files, BioDockLab aims to structure them into reusable data that can be:

* Analyzed
* Compared
* Simulated
* Summarized
* Reused in future experiments

---

## 2. Core Concept

BioDockLab is built around four main concepts.

### 2.1 Experiment Data Management

BioDockLab manages biological experiment records such as:

* Experiment name
* Experiment date
* Sample type
* Experimental condition
* Observation result
* Success rate
* Risk level
* Research notes
* Report summary

This allows experiment results to be stored in a structured format and reused for future comparison or analysis.

### 2.2 AI-Based Experiment Analysis

The AI module provides lightweight experiment analysis based on experimental conditions, success rate, risk level, and observation results.

Current analysis directions include:

* Experiment result summary
* Success rate evaluation
* Risk level classification
* Priority recommendation
* Future experiment direction suggestion
* ML-ready feature engineering structure

The current version uses rule-based analysis as an MVP-level approach.

This can later be expanded into machine-learning-based prediction when enough experimental data is collected.

### 2.3 Digital Twin Simulation

The digital twin module estimates biological or experimental responses based on input parameters.

BioDockLab uses simulation logic to model how experimental outcomes may change depending on variables such as:

* Treatment strength
* Risk score
* Experimental condition
* Reaction time
* Temperature
* Sample state
* Response score

The digital twin module is one of the most important long-term directions of BioDockLab.

### 2.4 Research Report Generation

BioDockLab is designed to support automated research report generation.

Planned report outputs include:

* Experiment overview
* AI analysis result
* Risk and priority evaluation
* Digital twin simulation result
* Experiment comparison summary
* Markdown or PDF export

The goal is to help researchers organize experimental results into a clear report format.

---

## 3. Main Features

### 3.1 Experiment Data Dashboard

BioDockLab can display experiment data in a dashboard format.

The dashboard is intended to show:

* Experiment list
* Sample information
* Condition summary
* Success rate
* Risk level
* Analysis priority
* Experiment status

This makes it easier to understand experiment results at a glance.

### 3.2 Experiment Analysis Engine

The analysis engine evaluates experiment data and produces a simple interpretation of the result.

Example analysis output:

```text
Priority: High Priority
Risk Level: Low
Status: Stable
Recommendation: Continue similar condition
```

The current engine is intentionally simple so that the project can be tested and expanded step by step.

### 3.3 Risk Classification

BioDockLab includes a risk classification structure for experimental outcomes.

Risk classification may consider:

* Low success rate
* High risk score
* Unstable condition
* Incomplete observation
* Experimental failure pattern

This can later be expanded into more advanced classification logic.

### 3.4 Digital Twin Simulation

The digital twin simulation module predicts possible biological responses based on experiment parameters.

Example input parameters:

```text
Success Rate
Risk Score
Treatment Strength
Reaction Time
Condition Value
```

Example output:

```text
Predicted Response Score
Estimated Risk
Simulation Result
Recommended Adjustment
```

This module connects experiment data with simulation-based prediction.

### 3.5 Organoid Response Simulation

BioDockLab can be expanded to support organoid experiment modeling.

Organoid-related data may include:

* Organoid sample type
* Culture condition
* Treatment strength
* Drug response
* Viability score
* Observation result

This allows BioDockLab to act as a research assistant for organoid experiment tracking and response comparison.

### 3.6 CFPS Yield Simulation

BioDockLab can also be expanded toward CFPS, or Cell-Free Protein Synthesis.

CFPS-related data may include:

* Reaction temperature
* Reaction time
* Enzyme quality
* Substrate level
* Protein yield
* Production success rate

This allows BioDockLab to support bio-manufacturing and protein-production experiment records.

---

## 4. Technology Stack

BioDockLab currently consists of two connected software directions:

1. the **core Bio-AI research platform**, which manages experiment data, analysis, simulation, and reporting, and  
2. the **Bio AI CellScope exhibition system**, which connects a Raspberry Pi-based edge device with a kiosk-style research experience.

### Frontend / Exhibition UI

* React
* TypeScript
* Vite
* Custom CSS
* Lucide React
* Browser `localStorage`
* Browser Print API
* Web Speech API (`SpeechSynthesis`) for Korean TTS
* Kiosk-style interaction flow
* Keyboard operator controls (`Enter` start / `Esc` reset)

### CellScope Edge Device

* Raspberry Pi 5
* Raspberry Pi Camera Module 3
* GPIO button interface
* WS2812B LED ring
* Local device health monitoring
* Camera capture and image-preview workflow
* Device-state synchronization between UI and hardware

### CellScope Local API

The booth frontend communicates with the CellScope device through a local REST-style API.

```text
GET  /api/cellscope/health
GET  /api/cellscope/sample
POST /api/cellscope/capture
POST /api/cellscope/analyze
POST /api/cellscope/led
GET  /api/cellscope/image/latest
```

The current device state flow is:

```text
idle
  ↓
checking-device
  ↓
waiting-for-sample
  ↓
sample-detected
  ↓
capturing
  ↓
analyzing
  ↓
complete / error
```

### Backend / Research Platform

* Python
* FastAPI
* JSON-based sample data
* Python standard-library HTTP server for the CellScope mock-device environment
* REST / JSON interface design

### AI / Simulation

* Python
* Rule-based experiment analysis
* Risk classification
* Feature-engineering structure
* Digital twin-style simulation
* Organoid response simulation
* CFPS yield estimation
* Protein-structure exploration UI
* Educational AI structure-prediction visualization
* Educational candidate / docking-reference comparison

> The current booth implementation does **not** run a validated clinical AI model, AlphaFold inference pipeline, or real-time molecular docking engine. Protein-structure prediction and docking-related screens are educational research visualizations and reference comparisons.

### Reporting / Research Trail

* Session-based Research Trail
* A4 research report layout
* Researcher-card output
* Browser print / PDF workflow
* QR-style result presentation
* Markdown documentation

### Development / Collaboration

* Git
* GitHub
* Feature-branch workflow
* Pull Requests
* Build verification with TypeScript and Vite
* Mock-device integration testing

### Exhibition Architecture

```text
Camera Module 3
      ↓
Raspberry Pi 5
      ↓
CellScope Local API
      ↓
REST / JSON
      ↓
React + TypeScript Kiosk UI
      ↓
Bio AI Research Experience
      ↓
TTS + Visualization + Research Trail
```
---

## 5. Project Structure

```text
BioDockLab/
├── .github/              # GitHub workflows and repository configuration
├── ai/                   # Experiment analysis and risk classification
├── backend/              # FastAPI backend prototype
├── bio/                  # Bio-domain logic
├── booth/                # Bio AI CellScope exhibition kiosk and mock device
├── data/
│   └── sample/           # Sample experiment data
├── database/             # Database-related structure
├── docs/                 # Development notes and technical documents
├── experiments/          # Experiment-related files
├── frontend/             # Dashboard and UI prototype
├── imaging/              # Biological and medical imaging experiments
├── quantum/              # Long-term quantum biocomputing research notes
├── reports/              # Report output and templates
├── simulation/           # Digital twin, organoid, and CFPS simulation
├── src/                  # Shared source modules
└── viewer/               # Data viewer prototype
```

---

## 6. Current Development Status

BioDockLab is currently in the **MVP / prototype stage**.

### Implemented or Partially Implemented

* [x] Experiment sample data structure
* [x] FastAPI backend prototype
* [x] Experiment list API
* [x] Experiment detail API
* [x] Rule-based experiment analyzer
* [x] Risk classifier
* [x] Digital twin simulation function
* [x] Organoid response simulator
* [x] CFPS yield simulator
* [x] Dashboard prototype
* [x] Development documentation
* [x] Bio AI CellScope kiosk UI
* [x] CellScope demo / device adapter
* [x] Raspberry Pi local API contract
* [x] Device health-check and recovery flow
* [x] Camera capture / preview integration
* [x] GPIO button and WS2812B LED interface contract
* [x] Kiosk operator controls and exhibition flow
* [x] Browser-based Korean TTS foundation
* [ ] Complete frontend and backend integration
* [ ] Automated research report generation
* [ ] Real biological validation

The project already has the basic structure for a bio-AI research software platform.

The next step is to connect each module into one executable workflow.

---

## 7. Current Limitations

BioDockLab is still an early-stage research software prototype.

Current limitations include:

* Experiment CRUD is not fully implemented
* AI analysis is currently rule-based
* Digital twin simulation is still function-level
* Frontend and backend are not fully integrated
* Report generation is not fully automated
* Real biological validation has not been performed
* Medical or clinical use is not supported

This project should currently be understood as a software prototype and research-assistant concept, not as a validated medical system.

---

## 8. Development Roadmap

### v2.1 — Experiment Data MVP

**Goal:** Build the core experiment data management structure.

Planned tasks:

* [ ] Clean up sample data schema
* [ ] Add experiment create, update, and delete logic
* [ ] Improve FastAPI route structure
* [ ] Connect dashboard to backend data
* [ ] Add basic experiment detail view

### v2.2 — AI Analysis Layer

**Goal:** Connect experiment data with AI-based analysis.

Planned tasks:

* [ ] Add AI analysis API endpoint
* [ ] Return risk classification result
* [ ] Return priority recommendation
* [ ] Generate experiment summary
* [ ] Prepare ML-ready feature structure

### v2.3 — Digital Twin MVP

**Goal:** Build the first usable digital twin simulation workflow.

Planned tasks:

* [ ] Add digital twin simulation API
* [ ] Add parameter-based simulation input
* [ ] Return predicted response score
* [ ] Visualize simulation result in dashboard
* [ ] Connect organoid and CFPS simulation logic

### v2.4 — Research Report System

**Goal:** Generate structured research reports from experiment data.

Planned tasks:

* [ ] Generate Markdown report
* [ ] Include experiment summary
* [ ] Include AI analysis result
* [ ] Include simulation result
* [ ] Prepare PDF export structure

### v3.0 — Bio-AI Research Platform

**Goal:** Integrate experiment data, AI analysis, simulation, and report generation into one platform.

Planned tasks:

* [ ] Integrated research dashboard
* [ ] Experiment comparison view
* [ ] Digital twin simulation screen
* [ ] Automated report export
* [ ] Test and CI workflow
* [ ] Improved documentation
* [ ] Future ML pipeline preparation

---

## 9. Expansion Areas

### 9.1 Organoid

Organoids are stem-cell-based mini organ models used for disease modeling, drug-response analysis, and therapeutic candidate evaluation.

In BioDockLab, organoid experiments can be connected through:

* Sample tracking
* Culture condition records
* Drug response data
* Viability score comparison
* Similar experiment recommendation
* Response simulation

Organoid support is one of the most practical expansion directions for BioDockLab.

### 9.2 CFPS

CFPS stands for **Cell-Free Protein Synthesis**.

It allows protein production without living-cell culture by using enzymes, amino acids, and reaction conditions.

In BioDockLab, CFPS can be connected through:

* Protein-production condition records
* Reaction temperature
* Reaction time
* Enzyme quality
* Substrate level
* Yield estimation
* Success rate comparison

This can expand BioDockLab toward bio-manufacturing and synthetic-biology workflows.

### 9.3 Digital Twin

Digital twin is the core long-term direction of BioDockLab.

In this project, digital twin means a software-based simulation layer that connects:

```text
Experiment Condition
    ↓
AI Analysis
    ↓
Predicted Biological Response
    ↓
Risk / Success Estimation
```

The goal is to help researchers test experimental possibilities before performing the next physical experiment.

### 9.4 Surgery AI

Surgery AI is treated as a long-term healthcare data-flow extension.

It is not the current core implementation target.

Possible future directions:

* Medical data-flow visualization
* Risk report generation
* Surgical decision-support data structure
* Clinical workflow simulation

This area requires careful ethical, clinical, and regulatory consideration.

### 9.5 Quantum Biocomputing

Quantum biocomputing is managed as a long-term research keyword.

Possible future directions:

* Molecular simulation
* Protein structure analysis
* Genome-scale computation
* Large biological system modeling

At the current stage, this is not a direct implementation target.

---

## 10. MVP Target

The most important short-term MVP is:

```text
Experiment Data Registration
    ↓
AI Risk Analysis
    ↓
Digital Twin Prediction
    ↓
Dashboard Visualization
    ↓
Research Report Generation
```

This MVP would make BioDockLab more than a documentation repository.

It would become an executable research-assistant software prototype.

---

## 11. Example Workflow

1. A researcher registers an experiment.
2. BioDockLab stores the experiment condition and result.
3. The AI module analyzes the success rate and risk level.
4. The simulation module predicts possible response changes.
5. The dashboard visualizes experiment status and simulation output.
6. The report module generates a research summary.

This workflow is the central product direction of BioDockLab.

---

## 12. Why This Project Matters

BioDockLab explores how computer science can support biological research workflows.

The project combines:

* Data management
* AI analysis
* Simulation
* Digital twin concepts
* Bio-domain software architecture
* Research report automation

The long-term goal is to build a bridge between experimental biology and software engineering.

---

## 13. Purpose

BioDockLab was built to explore how computer science, AI, and biological research workflows can be connected into one research software system.

The project aims to demonstrate:

* Bio-domain software design
* AI-assisted experiment analysis
* Research data management
* Digital twin simulation concepts
* Expandable scientific software architecture
* Practical research-assistant platform design

---

## 14. Team

BioDockLab is developed and maintained by:

| Name | GitHub                                 | Role                                |
| ---- | -------------------------------------- | ----------------------------------- |
| 이영준  | [@gxmzung](https://github.com/gxmzung) | Project Lead / Software Development |
| 홍정우  | GitHub username required               | Team Member                         |
| 류승훈  | GitHub username required               | Team Member                         |
| 이승민  | GitHub username required               | Team Member                         |
| 장문수  | GitHub username required               | Team Member                         |

### Organization

* GitHub Organization: `BioDockLab`
* Main Repository: `BioDockLab/BioDockLab`
* University: Paejae University

> Detailed responsibilities will be documented after each member's development role is finalized.

---

## 15. Disclaimer

> [!WARNING]
> BioDockLab is a research software prototype.

BioDockLab is not:

* A medical device
* A diagnostic tool
* A clinical decision-making system
* A validated biological prediction system
* A replacement for researchers or medical professionals

All simulation and analysis results are intended only for:

* Software demonstration
* Research workflow exploration
* Educational use
* Prototype development

Real biological, medical, or clinical decisions must not be made solely based on BioDockLab outputs.

---

## License

A project license has not yet been finalized.

Before external distribution or commercial use, the team should select and add an appropriate open-source license.

---

## Contact

For project-related discussions, use the GitHub repository's Issues or Discussions section.

```text
GitHub Organization: https://github.com/BioDockLab
Main Repository: https://github.com/BioDockLab/BioDockLab
```
