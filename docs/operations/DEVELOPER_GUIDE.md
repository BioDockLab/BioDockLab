# Developer Guide

## Purpose

This guide explains how future contributors should understand the BioDockLab repository.

## Development Principles

- Keep medical and biological claims conservative.
- Separate prototype logic from validated claims.
- Document assumptions clearly.
- Prefer explainable analysis before advanced ML.
- Keep sample data anonymized.
- Avoid using real personal medical data.

## Folder Guide

- backend: API prototype
- frontend: dashboard prototype
- ai: analysis logic
- simulation: digital twin and bio simulation concepts
- reports: report generation
- docs: research, validation, architecture, and operations notes
- sample_data: non-sensitive demonstration data

## Commit Style

Recommended commit prefixes:

- docs: documentation updates
- feat: new feature
- fix: bug fix
- refactor: internal cleanup
- chore: maintenance work

## Review Checklist

Before adding new features:

- Is the claim safe?
- Is the data non-sensitive?
- Is the limitation documented?
- Is the feature connected to the MVP?
- Is the folder location clear?
