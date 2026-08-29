# ADR-004: Why Modular BioDockLab Architecture

## Status

Accepted

## Context

BioDockLab includes several different concerns: experiment records, AI analysis, simulation, dashboard, reports, security, and documentation.

A single flat structure would make the project harder to explain and maintain.

## Decision

BioDockLab uses a modular repository structure.

## Modules

- ai: analysis and classification logic
- backend: FastAPI prototype
- bio: bio-domain logic
- frontend: dashboard prototype
- simulation: digital twin, organoid, and CFPS simulation
- reports: report generation
- sample_data: sample experiment datasets
- docs: architecture, research, validation, and operations documents

## Reasons

- Easier to explain
- Easier to maintain
- Supports future team collaboration
- Separates research notes from executable code
- Makes the project look closer to a real research software platform

## Consequences

Positive:

- Clear project boundaries
- Better documentation flow
- Easier reviewer navigation

Trade-offs:

- More folders to maintain
- Requires consistent documentation discipline
