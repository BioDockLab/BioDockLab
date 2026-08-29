# ADR-001: Why FastAPI

## Status

Accepted

## Context

BioDockLab needs a backend API layer for experiment records, AI analysis, simulation results, and report generation.

The backend should be lightweight, easy to prototype, and compatible with Python-based analysis modules.

## Decision

BioDockLab uses FastAPI as the first backend framework.

## Reasons

- Python-native backend framework
- Good fit for AI and data-processing modules
- Simple API structure
- Easy to document and test
- Suitable for MVP development
- Compatible with future ML and simulation workflows

## Consequences

Positive:

- Fast prototype development
- Easy integration with Python analysis code
- Clear API route structure

Trade-offs:

- Production security and deployment must be handled later
- Database and authentication layers require additional design
