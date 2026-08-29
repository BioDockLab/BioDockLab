# CellScope Mock Device

Local Raspberry Pi mock server for the Bio AI CellScope booth frontend.

This server allows the CellScope `device` mode to be tested before the physical Raspberry Pi, Camera Module 3, GPIO button, and WS2812B LED ring are available.

## Purpose

The mock server simulates the Raspberry Pi-side CellScope API.

It is intended for:

- frontend integration testing
- device mode verification
- API contract validation
- booth rehearsal before hardware arrival
- error isolation between frontend and Raspberry Pi software

## Requirements

- Python 3
- BioDockLab repository
- CellScope booth frontend

No additional Python package installation is required.

The mock server uses Python standard library modules only.

## Run Mock Device

From the repository root:

```powershell
python booth\mock-device\server.py

Default endpoint:

http://127.0.0.1:8765
API Endpoints
Health
GET /api/cellscope/health

Example response:

{
  "ok": true,
  "camera": true,
  "button": true,
  "led": true,
  "service": "CellScope Mock Raspberry Pi"
}
Sample Detection
GET /api/cellscope/sample

Returns the mock educational brain organoid sample.

Analysis
POST /api/cellscope/analyze

Example body:

{
  "sample": {
    "id": "ORG-BRAIN-001"
  }
}

The mock analysis returns educational morphology, structure, and distribution scores.

LED State
POST /api/cellscope/led

Example:

{
  "state": "analyzing"
}

Supported states:

idle
checking-device
waiting-for-sample
sample-detected
capturing
analyzing
complete
error
Debug
GET /api/cellscope/debug

Returns current mock device state.

Run Frontend

Open another PowerShell terminal:

cd booth
npm run dev

Then open:

http://localhost:5173/?cellscope=device

The cellscope=device query parameter forces the frontend to use the device API instead of internal demo data.

Expected Flow
idle
→ checking-device
→ waiting-for-sample
→ sample-detected
→ capturing
→ analyzing
→ complete

During a successful test the frontend communicates with:

GET  /api/cellscope/health
GET  /api/cellscope/sample
POST /api/cellscope/analyze
POST /api/cellscope/led
Hardware Transition

When the Raspberry Pi implementation is ready, the mock server can be replaced by the Pi local service without changing the frontend API contract.

The physical implementation is expected to provide:

Camera Module 3 integration
GPIO button input
WS2812B LED ring control
CellScope sample acquisition
analysis service integration
Scope

This mock environment is for educational booth integration testing.

It does not perform medical diagnosis, treatment recommendation, or clinical evaluation.