# Data Flow

## Purpose

This document explains the expected data flow inside BioDockLab.

## Main Flow

Experiment data is registered, structured, analyzed, simulated, visualized, and summarized into a report.

## Step 1: Experiment Data Registration

Input may include:

- Experiment name
- Sample type
- Experimental condition
- Observation result
- Success rate
- Risk score
- Research notes

## Step 2: Data Structuring

Raw input is organized into a reusable experiment record.

## Step 3: AI Analysis

The analysis layer evaluates:

- Risk level
- Priority
- Success tendency
- Recommendation summary

## Step 4: Digital Twin Simulation

The simulation layer estimates possible response changes based on selected parameters.

## Step 5: Dashboard Visualization

The dashboard presents experiment status, risk, priority, and simulation results.

## Step 6: Research Report

The report layer generates a structured research summary.

## Current Limitations

- Data flow is partially implemented.
- Frontend and backend integration is incomplete.
- Real biological validation is not included.
