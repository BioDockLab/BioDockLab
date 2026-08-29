# BioDockLab v2 Development Note

## Purpose

This document summarizes the v2 development direction of BioDockLab.

BioDockLab v2 focuses on turning the project from a concept-level research platform into a more executable MVP structure.

## Main Direction

BioDockLab v2 focuses on:

- Experiment data management
- AI-based risk analysis
- Digital twin-style simulation
- Dashboard visualization
- Research report generation

## Development Goals

### 1. Experiment Data MVP

- Clean up sample data schema
- Add experiment create, update, and delete flow
- Improve FastAPI route structure
- Connect dashboard to backend data
- Add experiment detail view

### 2. AI Analysis Layer

- Add AI analysis API endpoint
- Return risk classification result
- Return priority recommendation
- Generate experiment summary
- Prepare ML-ready feature structure

### 3. Digital Twin MVP

- Add digital twin simulation API
- Add parameter-based simulation input
- Return predicted response score
- Visualize simulation result in dashboard
- Connect organoid and CFPS simulation logic

### 4. Research Report System

- Generate Markdown report
- Include experiment summary
- Include AI analysis result
- Include simulation result
- Prepare PDF export structure

## Current Limitations

BioDockLab is still an early-stage research software prototype.

Current limitations:

- AI analysis is currently rule-based
- Digital twin simulation is still function-level
- Frontend and backend are not fully integrated
- Real biological validation has not been performed
- Medical or clinical use is not supported

## Next Step

The next priority is to connect the existing modules into one executable research workflow:

Experiment Data Registration → AI Risk Analysis → Digital Twin Prediction → Dashboard Visualization → Research Report Generation
