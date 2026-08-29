# ADR-002: Why Rule-Based MVP

## Status

Accepted

## Context

BioDockLab aims to analyze experiment records and provide risk or priority evaluation.

At the current stage, there is not enough validated biological data to train or justify a machine learning model.

## Decision

BioDockLab starts with rule-based analysis for the MVP stage.

## Reasons

- Avoids unsupported AI claims
- Makes logic easier to explain
- Supports transparent analysis
- Works with small sample datasets
- Allows fast prototype validation
- Can later evolve into ML-based prediction

## Consequences

Positive:

- Clear and explainable behavior
- Lower risk of overclaiming
- Easier for reviewers to understand

Trade-offs:

- Limited predictive power
- Requires future validation with real data
- May need redesign when sufficient datasets are collected
