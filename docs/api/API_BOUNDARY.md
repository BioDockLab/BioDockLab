# API Boundary

## Purpose

This document defines what the BioDockLab API should and should not do.

## In Scope

The API may support:

- Experiment data registration
- Experiment data retrieval
- Rule-based analysis
- Risk and priority scoring
- Digital twin-style simulation
- Report generation
- Sample data workflow testing

## Out of Scope

The API does not support:

- Medical diagnosis
- Clinical decision-making
- Emergency response
- Prescription recommendation
- Real patient treatment
- Production medical data handling

## Data Boundary

The API should only use:

- Sample data
- Anonymized demonstration data
- Research workflow data
- Non-sensitive test records

The API should not store or process real sensitive medical data at the current stage.

## Current Status

The API boundary is intentionally conservative because BioDockLab is an early-stage research software prototype.
